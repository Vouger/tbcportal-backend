import { InputType, Field } from "type-graphql";

@InputType()
export class GetTwitchStreamInput {
    @Field({ nullable: true, defaultValue: 5 })
    limit?: number;
}