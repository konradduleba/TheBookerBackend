import { EMessageFailed } from "../Enums/EMessage.enum";
import IValidatedUserDataInterface from "./IValidatedUserDataInterface";

export default interface IReturnedInfoFromBackend {
    isSuccess: boolean;
    message?: EMessageFailed;
    userData?: IValidatedUserDataInterface;
}