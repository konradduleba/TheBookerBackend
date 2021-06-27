import IUserDataInterface from "./IUserDataInterface";

export default interface ICheckTokenAndReturnUserDataInterface {
    isSuccess: boolean;
    userData?: IUserDataInterface;
}