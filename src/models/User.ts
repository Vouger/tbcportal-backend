import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import * as bcrypt from "bcryptjs";
import {Class} from "./Guide";

export enum Type {
    Email = 'Email',
    Google = 'Google'
}

export enum Role {
    User = 'User',
    Admin = 'Admin'
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
    @Column({ unique: true })
    nickname: string;

    @Field(() => String)
    @Column({default: 'Email'})
    type: Type;

    @Field(() => String)
    @Column({ default: 'User'} )
    role: Role;

    @Field(() => Boolean)
    @Column({ nullable: false, default: false })
    verified: boolean;

    @Field(() => String)
    token: string;

    static async getByNickname(nickname: string) {
        let user = await User.findOne({ where: { nickname: nickname } });

        return user;
    }

    async setPassword(password: string) {
        const salt = await bcrypt.genSalt(10);

        this.password = await bcrypt.hash(password, salt);
    }

    async isPasswordValid(password: string) {
        return await bcrypt.compare(password, this.password);
    }
}
