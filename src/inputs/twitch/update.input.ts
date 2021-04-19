import { InputType, Field } from "type-graphql";

import { Class, Content } from "../../models/Guide";

@InputType()
export class UpdateTwitchStreamInput {
    @Field()
    id: string;

    @Field()
    name: string;

    @Field()
    order: number;
}