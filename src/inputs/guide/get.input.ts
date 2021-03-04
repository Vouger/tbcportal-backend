import { InputType, Field } from "type-graphql";

@InputType()
export class GetGuideInput {
    @Field()
    filterClass: string;

    @Field()
    filterContent: string;
}