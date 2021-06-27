import { UserData } from "src/user/userData.entity";
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { FirstPrivacyOptions, SecondPrivacyOptions } from "./Enums/PrivacyOptions.enum";
import IPrivacyInterface from './Types/IPrivacyInteface';

@Entity()
export class Privacy extends BaseEntity implements IPrivacyInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 30,
        default: FirstPrivacyOptions.EVERYONE
    })
    seeFuturePosts: FirstPrivacyOptions;

    @Column({
        length: 30,
        default: FirstPrivacyOptions.EVERYONE
    })
    following: FirstPrivacyOptions;

    @Column({
        length: 30,
        default: SecondPrivacyOptions.EVERYONE
    })
    friendRequest: SecondPrivacyOptions;

    @Column({
        length: 30,
        default: FirstPrivacyOptions.EVERYONE
    })
    friendList: FirstPrivacyOptions;

    @Column({
        length: 30,
        default: FirstPrivacyOptions.EVERYONE
    })
    tag: FirstPrivacyOptions;

    @Column({
        length: 30,
        default: FirstPrivacyOptions.EVERYONE
    })
    phoneNumber: FirstPrivacyOptions;

    @Column({
        length: 30,
        default: FirstPrivacyOptions.EVERYONE
    })
    emailAddress: FirstPrivacyOptions;

    @OneToOne(type => UserData)
    user: UserData

}