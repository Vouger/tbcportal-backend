import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";
import { getRepository } from "typeorm";

import {CreatePostInput} from "../inputs/post/create.input";
import CurrentUser from "../decorators/current-user";
import {User} from "../models/User";
import {Post} from "../models/Post";

@Resolver()
export class PostsResolver {
    @Query(() => [Post])
    posts() {
        return getRepository(Post).find({
            take: 10,
            relations: ["user"],
            order: {
                created: "DESC"
            }
        });
    }

    @Query(() => Post)
    async post(@Arg("id") id: string) {
        let post = await Post.findOne({where: {id}});

        if (post) {
            post.views = post.views + 1;
            await post.save();
        }

        return post;
    }

    @Authorized(['Admin'])
    @Mutation(() => Post)
    async createPost(@Arg("data") data: CreatePostInput, @CurrentUser() user: User) {
        let post = Post.create({
            ...data,
            user: user,
        });
        await post.save();
        return post;
    }
}