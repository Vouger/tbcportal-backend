import {Resolver, Mutation, Arg, Query} from "type-graphql";
import * as bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library"

import { User, Type } from "../models/User";
import { CreateUserInput } from "../inputs/user/create.input";
import { LoginInput } from "../inputs/auth/login.input";
import { ConfirmationInput } from "../inputs/auth/confirmation.input";
import { PasswordChangeInput } from "../inputs/auth/password/change.input";
import { PasswordRequestInput } from "../inputs/auth/password/request.input";
import { GoogleInput } from "../inputs/auth/google.input";

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
        let existingUser = await User.findOne({ where: { email: data.email } });

        if (existingUser) {
            throw new Error("User with this email already exist!");
        }

        const salt = await bcrypt.genSalt(10);

        let user = User.create({
            ...data,
            password: await bcrypt.hash(data.password, salt)
        });

        await user.save();

        const emailService = new EmailService();
        await emailService.sendConfirmationEmail(user);

        return user;
    }

    @Mutation(() => User)
    async login(@Arg("data") data: LoginInput) {
        try {
            let user = await User.findOneOrFail({ where: { email: data.email } });

            let isValid = await bcrypt.compare(data.password, user.password);
            if (!isValid) throw new Error("Email or password invalid!");
            if (!user.verified) throw new Error("Email is not verified!");

            return {
                ...user,
                token: getToken({user, expires: data.remember ? '1d' : '1h'})
            };
        } catch (e) {
            throw new Error("Email or password invalid!");
        }
    }

    @Mutation(() => User)
    async confirmation(@Arg("data") data: ConfirmationInput) {
        let userId;

        try {
            userId = parseToken(data.token);
        } catch (e) {
            throw new Error("User not found!");
        }

        let user = await User.findOneOrFail(userId);
        if (user.verified) throw new Error("Email already verified!");

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
            throw new Error("Email is invalid!");
        }
    }

    @Mutation(() => User)
    async passwordChange(@Arg("data") data: PasswordChangeInput) {
        let userId;

        try {
            userId = parseToken(data.token);
        } catch (e) {
            throw new Error("User not found!");
        }

        let user = await User.findOneOrFail(userId);
        if (!user.verified) throw new Error("Email is not verified!");

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(data.password, salt)

        await user.save();

        return {
            ...user,
            token: getToken({user})
        };
    }

    @Mutation(() => User)
    async googleAuth(@Arg("data") data: GoogleInput) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const token = data.token

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        let user = await User.findOne({ where: { email: payload?.email } });

        if (!user) {
            user = User.create({
                email: payload?.email,
                firstname: payload?.given_name,
                lastname: payload?.family_name,
                type: Type.Google,
                verified: true
            });
            await user.save();
        }

        return {
            ...user,
            token: getToken({user, expires: '1d'})
        };
    }
}