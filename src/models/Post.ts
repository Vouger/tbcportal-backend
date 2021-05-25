import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    getRepository
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

import { User } from "./User";
import {GetPostsInput} from "../inputs/post/get.input";

@Entity()
@ObjectType()
export class Post extends BaseEntity {
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


    static async getAndCount(filter: GetPostsInput) {
        const { take, page } = filter;

        let skip = 0;

        if (page && take) {
            skip = (page - 1 ) * take;
        }

        const [result, total] = await getRepository(Post).findAndCount({
            take,
            skip,
            relations: ["user"],
            order: {
                created: "DESC"
            }
        });

        return {
            list: result,
            total: total
        }
    }
}
