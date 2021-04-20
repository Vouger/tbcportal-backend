import { InputType, Field } from "type-graphql";

@InputType()
export class GetPostInput {
    @Field()
    limit: string;

    @Field()
    offset: string;
}