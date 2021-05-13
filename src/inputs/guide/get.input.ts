import { InputType, Field } from "type-graphql";

@InputType()
export class GetGuideInput {
    @Field()
    filterClass: string;

    @Field()
    filterContent: string;

    @Field({ nullable: true, defaultValue: 12 })
    take?: number;

    @Field({ nullable: true, defaultValue: 1 })
    page?: number;

    @Field({ nullable: true })
    orderBy?: string;

    @Field({ nullable: true })
    keyword?: string;

    @Field({ nullable: true })
    isApproved?: boolean;
}