import {Resolver, Mutation, Arg, Query} from "type-graphql";

import { User } from "../models/User";
import { CreateUserInput } from "../inputs/user/create.input";
import { LoginInput } from "../inputs/auth/login.input";
import { ConfirmationInput } from "../inputs/auth/confirmation.input";
import { PasswordChangeInput } from "../inputs/auth/password/change.input";
import { PasswordRequestInput } from "../inputs/auth/password/request.input";

import { getToken, parseToken } from "../auth/token.helper";
import { EmailService } from "../services/email.service";

@Resolver()
export class AuthResolver {
    @Query(() => String)
    health() {
        return "working";
    }

    @Mutation(() => User)
    async register(@Arg("data") data: CreateUserInput) {
        let existingEmail = await User.findOne({ where: { email: data.email } });

        if (existingEmail) {
            throw new Error("Пользователь с таким имейлом уже зарегистрирован");
        }

        let existingNickname = await User.getByNickname(data.nickname);

        if (existingNickname) {
            throw new Error("Такой nickname уже занят!");
        }

        let user = User.create(data);
        await user.setPassword(data.password);

        await user.save();

        const emailService = new EmailService();
        await emailService.sendConfirmationEmail(user);

        return user;
    }

    @Mutation(() => User)
    async login(@Arg("data") data: LoginInput) {
        try {
            let user = await User.findOneOrFail({ where: { email: data.email } });

            let isValid = await user.isPasswordValid(data.password);
            if (!isValid) throw new Error("Имейл или пароль введен неверно!");

            if (!user.verified) throw new Error("Email не подтвержден!");

            return {
                ...user,
                token: getToken({user, expires: data.remember ? '1d' : '1h'})
            };
        } catch (e) {
            throw new Error("Имейл или пароль введен неверно!");
        }
    }

    @Mutation(() => User)
    async confirmation(@Arg("data") data: ConfirmationInput) {
        let userId;

        try {
            userId = parseToken(data.token);
        } catch (e) {
            throw new Error("Пользователь не найден!");
        }

        let user = await User.findOneOrFail(userId);
        if (user.verified) throw new Error("Этот email уже подтвержден!");

        user.verified = true;
        await user.save();

        return {
            ...user,
            token: getToken({user})
        };
    }

    @Mutation(() => User)
    async passwordRequest(@Arg("data") data: PasswordRequestInput) {
        try {
            let user = await User.findOneOrFail({ where: { email: data.email } });

            const emailService = new EmailService();
            await emailService.sendPasswordEmail(user);

            return user;
        } catch (e) {
            throw new Error("Пользователь с таким имейлом не найден!");
        }
    }

    @Mutation(() => User)
    async passwordChange(@Arg("data") data: PasswordChangeInput) {
        let userId;

        try {
            userId = parseToken(data.token);
        } catch (e) {
            throw new Error("Пользователь с таким имейлом не найден!");
        }

        let user = await User.findOneOrFail(userId);
        if (!user.verified) throw new Error("Email не подтвержден!");

        await user.setPassword(data.password);

        await user.save();

        return {
            ...user,
            token: getToken({user})
        };
    }
}