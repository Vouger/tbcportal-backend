import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";
import { getRepository } from "typeorm";

import { Guide } from "../models/Guide";
import { CreateGuideInput } from "../inputs/guide/create.input";
import {GetGuideInput} from "../inputs/guide/get.input";
import CurrentUser from "../decorators/current-user";
import {User} from "../models/User";

@Resolver()
export class GuidesResolver {
    @Query(() => [Guide])
    guides(@Arg("data") data : GetGuideInput) {
        let where = {};

        if (data.filterClass !== 'all') {
            where = {
                ...where,
                className: data.filterClass
            }
        }

        if (data.filterContent !== 'all') {
            where = {
                ...where,
                contentType: data.filterContent
            }
        }

        return getRepository(Guide).find({
            where,
            take: 10,
            relations: ["user"],
            order: {
                created: "DESC"
            }
        });
    }

    @Query(() => Guide)
    async guide(@Arg("id") id: string) {
        let guide = await Guide.findOne({where: {id}});

        if (guide) {
            guide.views = guide.views + 1;
            await guide.save();
        }

        return guide;
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