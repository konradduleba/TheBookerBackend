import { GroupPosts } from "src/group-posts/groupPosts.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import IPostComments from "./Types/IPostComments";

@Entity()
export class PostComments extends BaseEntity implements IPostComments {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    date: Date;

    @Column()
    authorName: string;

    @Column()
    authorLastname: string;

    @Column()
    authorUsername: string;

    @Column()
    authorId: string;

    @Column()
    isActive: boolean;

    @ManyToOne(type => GroupPosts, entity => entity.comments)
    post: GroupPosts
}