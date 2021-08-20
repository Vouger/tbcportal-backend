import { Resolver, Query, Arg, Mutation, Authorized } from "type-graphql";

import {CreatePostInput} from "../inputs/post/create.input";
import {UpdatePostInput} from "../inputs/post/update.input";
import {GetPostsResponse} from "../responses/post/get.response";
import {GetPostsInput} from "../inputs/post/get.input";
import CurrentUser from "../decorators/current-user";
import {User} from "../models/User";
import {Post} from "../models/Post";

@Resolver()
export class PostsResolver {
    @Query(() => GetPostsResponse)
    posts(@Arg("data") data: GetPostsInput) {
        return Post.getAndCount(data);
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

    @Authorized(['Admin'])
    @Mutation(() => Post)
    async updatePost(@Arg("data") data: UpdatePostInput) {
        let post = await Post.findOne({ where: { id: data.id } });

        if (!post) {
            throw new Error("Новость не найдена!");
        }

        post.title = data.title;
        post.thumbnailUrl = data.thumbnailUrl;
        post.text = data.text;

        await post.save();

        return post;
    }

    @Authorized(['Admin'])
    @Mutation(() => String)
    async deletePost(@Arg("id") id: string) {
        let post = await Post.findOne({ where: { id } });

        if (!post) {
            throw new Error("Новость не найдена!");
        }

        await post.remove();

        return 'Новость удалена';
    }
}
