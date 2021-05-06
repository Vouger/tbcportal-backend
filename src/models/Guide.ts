import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

import { User } from "./User";

export enum Class {
    druid = 'druid',
    hunter = 'hunter',
    mage = 'mage',
    paladin = 'paladin',
    priest = 'priest',
    rogue = 'rogue',
    shaman = 'shaman',
    warlock = 'warlock',
    warrior = 'warrior'
}

export enum Content {
    pve = 'pve',
    pvp = 'pvp',
    leveling = 'leveling',
    lore = 'lore'
}

@Entity()
@ObjectType()
export class Guide extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;


    @Field(() => String)
    @Column({
        charset: 'utf8',
        collation: 'utf8_general_ci',
    })
    title: string;

    @Field(() => String)
    @Column({
        charset: 'utf8',
        collation: 'utf8_general_ci',
        type: "longtext"
    })

    text: string;

    @Field(() => String)
    @Column({ nullable: true })
    className: Class;

    @Field(() => String)
    @Column({ nullable: true })
    contentType: Content;

    @Field(() => String)
    @Column({ nullable: true })
    thumbnailUrl: string;

    @Field(() => Number)
    @Column({default: 0})
    views: number;

    @Field(() => String)
    @Column()
    userId: string;

    @Field(() => User)
    @ManyToOne(type => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Field(() => Date)
    @CreateDateColumn()
    created: Date;

    @Field(() => Boolean)
    @Column({default: false})
    isApproved: boolean;
}
