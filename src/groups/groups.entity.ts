import { GroupPosts } from "src/group-posts/groupPosts.entity";
import { UserData } from "src/user/userData.entity";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinColumn, OneToMany } from "typeorm";
import IGroupList from "./Types/IGroupList";

@Entity()
export class Groups extends BaseEntity implements IGroupList {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    picture: string;

    @Column()
    owner: string;

    @ManyToMany(type => UserData, entity => entity.groupList)
    users: UserData[];

    @OneToMany(type => GroupPosts, entity => entity.group)
    @JoinColumn()
    posts: GroupPosts
}