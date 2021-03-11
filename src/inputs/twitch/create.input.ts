import { InputType, Field } from "type-graphql";

import { Class, Content } from "../../models/Guide";

@InputType()
export class CreateTwitchStreamInput {
    @Field()
    name: string;

    @Field()
    order: number;
}