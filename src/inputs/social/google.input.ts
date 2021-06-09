import { InputType, Field } from "type-graphql";

@InputType()
export class GoogleInput {
    @Field()
    token: string;
}