import { InputType, Field } from "type-graphql";

@InputType()
export class CreateSettingsInput {
    @Field()
    name: string;

    @Field()
    value: string;
}