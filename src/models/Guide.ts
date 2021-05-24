import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Like,
    getRepository
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

import { User } from "./User";
import {GetGuideInput} from "../inputs/guide/get.input";

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

    static async changeIsApprovedById(id: string, isApproved: boolean)
    {
        let guide = await Guide.findOne({where: {id}});

        if (!guide) {
            return false;
        }

        guide.isApproved = isApproved;
        await guide.save();

        return true;
    }

    static async getAndCount(filter: GetGuideInput) {
        const {filterClass, filterContent, keyword, take, page, orderBy, isApproved} = filter;

        let where = {
            isApproved: isApproved,
            className: filterClass,
            contentType: filterContent,
            title: Like("%" + keyword + "%")
        };

        if (where.className === 'all') {
            delete where.className;
        }

        if (where.contentType === 'all') {
            delete where.contentType;
        }

        let skip = 0;

        if (page && take) {
            skip = (page - 1 ) * take;
        }

        const [result, total] = await getRepository(Guide).findAndCount({
            where,
            take,
            skip,
            relations: ["user"],
            order: {
                created: orderBy === 'created' ? "DESC" : undefined,
                views: orderBy === 'views' ? "DESC" : undefined
            }
        });

        return {
            list: result,
            total: total
        }
    }
}
