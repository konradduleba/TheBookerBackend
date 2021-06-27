import IValidatedPrivacyDataInterface from "./IValidatedPrivacyDataInterface";

export default interface IReturnPrivacyInfoInterface {
    isSuccess: boolean;
    affected?: number;
    privacyInfo?: IValidatedPrivacyDataInterface;
}