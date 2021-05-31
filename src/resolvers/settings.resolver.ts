import {Resolver, Query, Arg, Mutation, Authorized} from "type-graphql";
import { getRepository } from "typeorm";

import {Settings} from "../models/Settings";
import {CreateSettingsInput} from "../inputs/settings/create.input";

@Resolver()
export class SettingsResolver {
    @Query(() => [Settings])
    settings(@Arg("names", type => [String]) names: String[]) {
        return getRepository(Settings)
            .createQueryBuilder()
            .where("name IN(:...names)", { names: names })
            .getMany();
    }

    @Authorized(['Admin'])
    @Mutation(() => String)
    async createOrUpdateSettings(@Arg("data", type => [CreateSettingsInput]) data: CreateSettingsInput[]) {
        await data.map(async (item) => {
            let setting = await Settings.findOne({where: { name: item.name }});

            if (! setting) {
                setting = Settings.create();
            }

            setting.name = item.name;
            setting.value = item.value;

            await setting.save();
        })

        return 'Сохранено'
    }
}