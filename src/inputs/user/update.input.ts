import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateInput {
    @Field({ nullable: true })
    nickname: string;
}