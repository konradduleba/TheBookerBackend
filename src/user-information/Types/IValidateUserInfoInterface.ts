import IAccountInfo from "./IAccountInfo";
import IBasicInfo from "./IBasicInfo";
import IContactInfo from "./IContactInfo";
import IPersonalInfo from "./IPersonalInfo";

export default interface IValidateUserInfoInterface {
    accountInfo: IAccountInfo;
    basicInfo: IBasicInfo;
    contactInfo: IContactInfo;
    personalInfo: IPersonalInfo;
}