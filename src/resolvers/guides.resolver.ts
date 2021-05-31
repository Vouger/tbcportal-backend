import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";

import { Guide } from "../models/Guide";
import { CreateGuideInput } from "../inputs/guide/create.input";
import { GetGuideInput } from "../inputs/guide/get.input";
import {GetGuideResponse} from "../responses/guide/get.response";
import CurrentUser from "../decorators/current-user";
import {User} from "../models/User";

@Resolver()
export class GuidesResolver {
    @Query(()  => GetGuideResponse)
    async guides(@Arg("data") data: GetGuideInput) {
        return Guide.getAndCount({...data, isApproved : true});
    }

    @Authorized(['Admin'])
    @Query(()  => GetGuideResponse)
    async adminGuides(@Arg("data") data: GetGuideInput) {
        return Guide.getAndCount({...data, isApproved : false});
    }

    @Query(() => Guide)
    async guide(@Arg("id") id: string) {
        let guide = await Guide.findOne({
            where: {id},
            relations: [ "user" ]
        });

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

    @Authorized(['Admin'])
    @Mutation(() => String)
    async approveGuide(@Arg("id") id: string) {
        const status = await Guide.changeIsApprovedById(id, true)

        if (! status) {
            throw new Error("Гайд не найден!");
        }

        return 'Подтвержден';
    }

    @Authorized(['Admin'])
    @Mutation(() => String)
    async hideGuide(@Arg("id") id: string) {
        const status = await Guide.changeIsApprovedById(id, false)

        if (! status) {
            throw new Error("Гайд не найден!");
        }

        return 'Спрятан';
    }
}