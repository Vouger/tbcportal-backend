import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";

import {CreateTwitchStreamInput} from "../inputs/twitch/create.input";
import {TwitchService} from "../services/twitch.service";
import {TwitchStream} from "../models/TwitchStream";


@Resolver()
export class TwitchResolver {
    @Query(() => [TwitchStream])
    async twitch() {
        let twitchStreams: TwitchStream[] = [];

        const twitchService = new TwitchService();
        await twitchService.getToken();

        const streams = await TwitchStream.find();

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
    @Mutation(() => TwitchStream)
    async createTwitchStream(@Arg("data") data: CreateTwitchStreamInput) {
        let existingStream = await TwitchStream.findOne({ where: { name: data.name } });

        if (existingStream) {
            throw new Error("Twitch Stream already added!");
        }

        let twitchStream = TwitchStream.create(data);

        await twitchStream.save();
        return twitchStream;
    }

    @Authorized(['Admin'])
    @Mutation(() => String)
    async removeTwitchStream(@Arg("id") id: string) {
        let twitchStream = await TwitchStream.findOne({ where: { id } });

        if (!twitchStream) {
            throw new Error("Not found!");
        }

        await twitchStream.remove();

        return 'Removed';
    }
}