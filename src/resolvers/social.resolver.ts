import {Resolver, Mutation, Arg} from "type-graphql";
import { OAuth2Client } from "google-auth-library";

import { User, Type } from "../models/User";
import { GoogleInput } from "../inputs/social/google.input";
import { SocialInput } from "../inputs/social/social.input";

import { getToken } from "../auth/token.helper";
import {DiscordService} from "../services/discord.service";

@Resolver()
export class SocialResolver {

    @Mutation(() => User)
    async googleAuth(@Arg("data") data: GoogleInput) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
        const token = data.token

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const name = payload?.given_name + ' ' + payload?.family_name;

        if (payload?.email) {
            const user = await User.getOrCreate(payload.email, name, Type.Google);

            return {
                ...user,
                token: getToken({user, expires: '1d'})
            };
        } else {
            throw Error('Произошла ошибка');
        }
    }


    @Mutation(() => User)
    async socialAuth(@Arg("data") data: SocialInput) {
        const discordService = new DiscordService();
        await discordService.getToken(data.code);

        const userInfo = await discordService.getUserInfo();

        if (userInfo?.email) {
            const user = await User.getOrCreate(userInfo.email, userInfo.username, Type.Discord);

            return {
                ...user,
                token: getToken({user, expires: '1d'})
            };
        } else {
            throw Error('Произошла ошибка');
        }
    }
}