import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";

import {CreateTwitchStreamInput} from "../inputs/twitch/create.input";
import {UpdateTwitchStreamInput} from "../inputs/twitch/update.input";
import {TwitchService} from "../services/twitch.service";
import {TwitchStream} from "../models/TwitchStream";
import {getRepository} from "typeorm";


@Resolver()
export class TwitchResolver {
    @Query(() => [TwitchStream])
    async twitch() {
        let twitchStreams: TwitchStream[] = [];

        const twitchService = new TwitchService();
        await twitchService.getToken();

        const streams = await getRepository(TwitchStream).find({
            order: {
                order: "ASC"
            }
        });

        await Promise.all(streams.map(async (item, i) => {
            const streamInfo = await twitchService.getStreamInfo(item.name);

            if (streamInfo && streamInfo.viewer_count) {
                const userInfo = await twitchService.getUserInfo(item.name);

                item.views = streamInfo.viewer_count;
                item.gameName = streamInfo.game_name;
                item.logo = userInfo.profile_image_url;

                twitchStreams.push(item)
            }
        }))

        return twitchStreams;
    }

    @Authorized(['Admin'])
    @Query(() => [TwitchStream])
    async adminTwitch() {
        return getRepository(TwitchStream).find({
            order: {
                order: "ASC"
            }
        });
    }

    @Authorized(['Admin'])
    @Query(() => TwitchStream)
    async getTwitchStream(@Arg("id") id: string) {
        return await TwitchStream.findOne({ where: { id } });
    }

    @Authorized(['Admin'])
    @Mutation(() => TwitchStream)
    async createTwitchStream(@Arg("data") data: CreateTwitchStreamInput) {
        let existingStream = await TwitchStream.findOne({ where: { name: data.name } });

        if (existingStream) {
            throw new Error("Этот стример уже добавлен!");
        }

        let twitchStream = TwitchStream.create(data);

        await twitchStream.save();
        return twitchStream;
    }

    @Authorized(['Admin'])
    @Mutation(() => TwitchStream)
    async updateTwitchStream(@Arg("data") data: UpdateTwitchStreamInput) {
        let twitchStream = await TwitchStream.findOne({ where: { id: data.id } });

        if (!twitchStream) {
            throw new Error("Стример не найден!");
        }

        twitchStream.name = data.name;
        twitchStream.order = data.order;

        await twitchStream.save();

        return twitchStream;
    }

    @Authorized(['Admin'])
    @Mutation(() => String)
    async removeTwitchStream(@Arg("id") id: string) {
        let twitchStream = await TwitchStream.findOne({ where: { id } });

        if (!twitchStream) {
            throw new Error("Стример не найден!");
        }

        const name = twitchStream.name;

        await twitchStream.remove();

        return `Стример ${name} удален`;
    }
}