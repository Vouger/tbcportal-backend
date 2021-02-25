import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

export enum Type {
    Email = 'Email',
    Google = 'Google'
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true })
    email: string;

    @Column({nullable: true})
    password: string;

    @Field(() => String)
    @Column()
    firstname: string;

    @Field(() => String)
    @Column()
    lastname: string;

    @Field(() => String)
    @Column({default: 'Email'})
    type: Type;


    @Field(() => Boolean)
    @Column({ nullable: false, default: false })
    verified: boolean;

    @Field(() => String)
    token: string;
}
