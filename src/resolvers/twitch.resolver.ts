import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";

import {CreateTwitchStreamInput} from "../inputs/twitch/create.input";
import {TwitchService} from "../services/twitch.service";
import {TwitchStream} from "../models/TwitchStream";


@Resolver()
export class TwitchResolver {
    @Query(() => [TwitchStream])
    async twitch() {
        const twitchService = new TwitchService();
        await twitchService.getToken();

        let streams = await TwitchStream.find();

        await Promise.all(streams.map(async (item, i) => {
            const data = await twitchService.getStreamInfo(item.name);

            if (data && data.viewer_count) {
                streams[i].views = data.viewer_count;
                streams[i].isLive = true;
            }
        }))

        return streams;
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