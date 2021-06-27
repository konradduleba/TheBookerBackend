import { UserData } from "src/user/userData.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import UserSettingsInteface from "./dto/userSettings.dto";
import UserRole from "./enums/UserRole.enum";

@Entity()
export class UserSettings extends BaseEntity implements UserSettingsInteface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    role: UserRole

    @OneToMany(type => UserData, entity => entity.userSettings)
    user: UserData
}