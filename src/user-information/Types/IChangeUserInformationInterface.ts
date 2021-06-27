import UserDataInterface from "src/user/dto/UserDataInterface.dto";

export default interface IChangeUserInformationInterface {
    user: UserDataInterface;
    options: {
        [key: string]: string;
    };
}