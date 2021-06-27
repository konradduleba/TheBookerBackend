import { FirstPrivacyOptions, SecondPrivacyOptions } from "../Enums/PrivacyOptions.enum";

export default interface IValidatedPrivacyDataInterface {
    seeFuturePosts: FirstPrivacyOptions;
    following: FirstPrivacyOptions;
    friendRequest: SecondPrivacyOptions;
    friendList: FirstPrivacyOptions;
    tag: FirstPrivacyOptions;
    phoneNumber: FirstPrivacyOptions;
    emailAddress: FirstPrivacyOptions;
}