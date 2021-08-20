import { InputType, Field } from "type-graphql";

@InputType()
export class UpdatePostInput {
    @Field()
    id: string;
    
    @Field()
    title: string;

    @Field()
    text: string;

    @Field()
    thumbnailUrl: string;
}
