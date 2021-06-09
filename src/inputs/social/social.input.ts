import { InputType, Field } from "type-graphql";

@InputType()
export class SocialInput {
    @Field()
    code: string;

    @Field()
    source: string;
}