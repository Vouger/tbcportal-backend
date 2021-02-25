import { InputType, Field } from "type-graphql";

@InputType()
export class PasswordChangeInput {
    @Field()
    password: string;

    @Field()
    token: string;
}