import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

@Entity()
@ObjectType()
export class TwitchStream extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true })
    name: string;

    @Field(() => Number)
    @Column({default: 0})
    order: number;

    @Field(() => Number)
    views: number = 0;

    @Field(() => String)
    gameName: string = '';

    @Field(() => String)
    logo: string = '';
}
