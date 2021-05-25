import {Field, ObjectType} from "type-graphql";
import {Post} from "../../models/Post";

@ObjectType()
export class GetPostsResponse {
    @Field(type => [Post])
    list: Post[];

    @Field()
    total?: number;
}