import UserSettings from "src/user-settings/dto/userSettings.dto";

export default interface IUserDataInterface {
    username: string;
    userSettings: UserSettings;
}