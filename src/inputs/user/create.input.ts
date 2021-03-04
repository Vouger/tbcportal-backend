import { InputType, Field } from "type-graphql";

@InputType()
export class CreateUserInput {
    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    nickname: string;
}