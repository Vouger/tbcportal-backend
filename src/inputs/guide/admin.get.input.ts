import { InputType, Field } from "type-graphql";

@InputType()
export class AdminGetGuideInput {
    @Field({ nullable: true, defaultValue: 12 })
    take?: number;

    @Field({ nullable: true, defaultValue: 0 })
    skip?: number;
}