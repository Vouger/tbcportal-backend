import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";
import { getRepository } from "typeorm";

import { Guide, Class } from "../models/Guide";
import { CreateGuideInput } from "../inputs/guide/create.input";
import CurrentUser from "../decorators/current-user";
import {User} from "../models/User";

@Resolver()
export class GuidesResolver {
    @Query(() => [Guide])
    guides(@Arg("filterClass", { defaultValue: '' }) filterClass: string) {
        let where = {};

        if (filterClass !== 'all') {
            where = {
                class: filterClass === 'all' ? null : filterClass
            }
        }

        return getRepository(Guide).find({
            where,
            take: 10,
            order: {
                created: "DESC"
            }
        });
    }

    @Authorized()
    @Mutation(() => Guide)
    async createGuide(@Arg("data") data: CreateGuideInput, @CurrentUser() user: User) {
        let guide = Guide.create({
            ...data,
            user: user,
        });
        await guide.save();
        return guide;
    }
}