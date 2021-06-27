import UserRole from "../enums/UserRole.enum";

export default interface UserSettings {
    id: string;
    role: UserRole;
}