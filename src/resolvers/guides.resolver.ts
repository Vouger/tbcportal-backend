import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";
import {getRepository, Like} from "typeorm";

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
        const {filterClass, filterContent, keyword, take, skip, orderBy} = data;

        let where = {
            className: filterClass,
            contentType: filterContent,
            title: Like("%" + keyword + "%")
        };

        if (where.className === 'all') {
            delete where.className;
        }

        if (where.contentType === 'all') {
            delete where.contentType;
        }

        const [result, total] = await getRepository(Guide).findAndCount({
            where,
            take,
            skip,
            relations: ["user"],
            order: {
                created: orderBy === 'created' ? "DESC" : undefined,
                views: orderBy === 'views' ? "DESC" : undefined
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