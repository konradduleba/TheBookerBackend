import { UserData } from "src/user/userData.entity";
import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import IUserInformationInterface from "./Types/IUserInformationInterface";

@Entity()
export class UserInformation extends BaseEntity implements IUserInformationInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    picture: string;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    lastUpdate: Date;

    @Column({
        default: () => 'CURRENT_TIMESTAMP',
    })
    memberSince: Date;

    @Column({
        nullable: true,
        default: null
    })
    email: string | null;

    @Column({
        nullable: true,
        default: null
    })
    phone: string | null;

    @Column({
        nullable: true,
        default: null
    })
    lookingFor: string | null;

    @Column({
        nullable: true,
        default: null
    })
    interestedIn: string | null;

    @Column({
        nullable: true,
        default: null
    })
    relationshipStatus: string | null;

    @Column({
        nullable: true,
        default: null
    })
    partner: string | null;

    @Column({
        nullable: true,
        default: null
    })
    interests: string | null;

    @Column({
        nullable: true,
        default: null
    })
    favouriteMusic: string | null;

    @Column({
        nullable: true,
        default: null
    })
    favouriteMovies: string | null;

    @Column({
        nullable: true,
        default: null
    })
    aboutMe: string | null;

    @Column({
        nullable: true,
        default: null
    })
    school: string | null;

    @Column({
        nullable: true,
        default: null
    })
    status: string | null;

    @Column({
        nullable: true,
        default: null
    })
    sex: string | null;

    @Column({
        nullable: true,
        default: null
    })
    city: string | null;

    @Column({
        nullable: true,
        default: null
    })
    birthday: Date | null;

    @OneToOne(type => UserData)
    user: UserData
}