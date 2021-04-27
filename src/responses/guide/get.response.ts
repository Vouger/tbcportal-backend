import {Field, ObjectType} from "type-graphql";
import {Guide} from "../../models/Guide";

@ObjectType()
export class GetGuideResponse {
    @Field(type => [Guide])
    list: Guide[];

    @Field()
    total?: number;
}