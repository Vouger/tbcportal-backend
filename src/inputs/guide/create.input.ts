import { InputType, Field } from "type-graphql";

import {Class} from "../../models/Guide";

@InputType()
export class CreateGuideInput {
    @Field()
    title: string;

    @Field()
    text: string;

    @Field()
    class: Class;
}