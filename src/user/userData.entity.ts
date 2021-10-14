import { FriendInvites } from "src/friend-list/friend-invites.entity";
import { FriendList } from "src/friend-list/friend-list.entity";
import { Groups } from "src/groups/groups.entity";
import { Privacy } from "src/privacy/privacy.entity";
import { UserInformation } from "src/user-information/user-information.entity";
import { UserSettings } from "src/user-settings/userSettings.entity";
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import UserDataInterface from "./dto/UserDataInterface.dto";

@Entity()
export class UserData extends BaseEntity implements UserDataInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 255
    })
    email: string;

    @Column()
    username: string;

    @Column()
    pwdHash: string;

    @Column({
        nullable: true,
        default: null
    })
    currentTokenId: string | null

    @Column({
        default: false
    })
    isDeactivated: boolean

    @Column({
        nullable: true,
        default: null
    })
    deactivationDate: Date | null;

    @ManyToOne(type => UserSettings, entity => entity.user)
    @JoinColumn()
    userSettings: UserSettings

    @OneToOne(type => Privacy)
    @JoinColumn()
    userPrivacy: Privacy

    @OneToOne(type => UserInformation)
    @JoinColumn()
    userInformation: UserInformation

    @ManyToMany(type => FriendList, entity => entity.users)
    @JoinTable()
    friendList: FriendList[]

    @ManyToMany(type => FriendInvites, entity => entity.users)
    @JoinTable()
    friendInvites: FriendInvites[]

    @ManyToMany(type => Groups, entity => entity.users)
    @JoinTable()
    groupList: Groups[]
}