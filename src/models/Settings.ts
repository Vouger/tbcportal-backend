import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

@Entity()
@ObjectType()
export class Settings extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true })
    name: string;

    @Field(() => String)
    @Column()
    value: string;
}
