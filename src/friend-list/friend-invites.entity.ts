import { UserData } from "src/user/userData.entity";
import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import IFriendList from "./Types/IFriendList";

@Entity()
export class FriendInvites extends BaseEntity implements IFriendList {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    picture: string;

    @Column()
    username: string;

    @ManyToMany(type => UserData, entity => entity.friendInvites)
    users: UserData[];
}