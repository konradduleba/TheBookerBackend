import ChangePrivacyOptionsInterface from "src/user/dto/ChangePrivacyOptionsInterface.dto";
import UserDataInterface from "src/user/dto/UserDataInterface.dto";

export default interface IChangePrivacySettingsInterface {
    user: UserDataInterface;
    options: ChangePrivacyOptionsInterface
}