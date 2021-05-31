import {Resolver, Mutation, Arg, Query, Authorized} from "type-graphql";

import { User } from "../models/User";
import { UpdateInput } from "../inputs/user/update.input";
import CurrentUser from "../decorators/current-user";

@Resolver()
export class UserResolver {
    @Authorized()
    @Query(() => User)
    async profileInfo(@CurrentUser() user: User) {
        return user;
    }

    @Authorized()
    @Mutation(() => User)
    async updateProfile(@Arg("data") data: UpdateInput, @CurrentUser() user: User) {
        let existingNickname = await User.getByNickname(data.nickname);

        if (existingNickname && existingNickname.id !== user.id) {
            throw new Error("Такой nickname уже занят!");
        }

        user.nickname = data.nickname;

        await user.save();

        return user;
    }
}