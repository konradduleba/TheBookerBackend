import UserRole from "src/user-settings/enums/UserRole.enum";

export default interface IAccountInfoInterface {
    username: string;
    userRole: UserRole;
}