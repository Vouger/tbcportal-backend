import { InputType, Field } from "type-graphql";

@InputType()
export class GetGuideInput {
    @Field()
    filterClass: string;

    @Field()
    filterContent: string;

    @Field({ nullable: true })
    take?: number;

    @Field({ nullable: true })
    skip?: number;
}