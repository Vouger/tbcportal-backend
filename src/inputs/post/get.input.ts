import { InputType, Field } from "type-graphql";

@InputType()
export class GetPostsInput {
    @Field({ nullable: true, defaultValue: 6 })
    take?: number;

    @Field({ nullable: true, defaultValue: 1 })
    page?: number;
}