import { InputType, Field } from "type-graphql";

@InputType()
export class ConfirmationInput {
    @Field()
    token: string;
}