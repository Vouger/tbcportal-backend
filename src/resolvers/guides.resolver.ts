import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";
import { getRepository } from "typeorm";

import { Guide } from "../models/Guide";
import { CreateGuideInput } from "../inputs/guide/create.input";
import {GetGuideInput} from "../inputs/guide/get.input";
import {GetGuideResponse} from "../responses/guide/get.response";
import CurrentUser from "../decorators/current-user";
import {User} from "../models/User";

@Resolver()
export class GuidesResolver {
    @Query(()  => GetGuideResponse)
    async guides(@Arg("data") data: GetGuideInput) {
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
        const [result, total] = await getRepository(Guide).findAndCount({
            where,
            take: data.take || 12,
            skip: data.skip || 0,
            relations: ["user"],
            order: {
                created: "DESC"
            }
        });

        return {
            list: result,
            total: total
        }
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