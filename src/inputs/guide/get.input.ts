import { InputType, Field } from "type-graphql";

@InputType()
export class GetGuideInput {
    @Field()
    filterClass: string;

    @Field()
    filterContent: string;

    @Field({ nullable: true, defaultValue: 12 })
    take?: number;

    @Field({ nullable: true, defaultValue: 0 })
    skip?: number;

    @Field({ nullable: true })
    orderBy?: string;

    @Field({ nullable: true })
    keyword?: string;
}