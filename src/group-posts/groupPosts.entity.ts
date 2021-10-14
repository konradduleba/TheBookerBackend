import { Groups } from "src/groups/groups.entity";
import { PostComments } from "src/post-comments/post-comments.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import IGroupPosts from "./Types/IGroupPosts";

@Entity()
export class GroupPosts extends BaseEntity implements IGroupPosts {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    date: Date;

    @Column()
    title: string;

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

    @ManyToOne(type => Groups, entity => entity.posts)
    group: Groups

    @OneToMany(type => PostComments, entity => entity.post)
    @JoinColumn()
    comments: PostComments
}