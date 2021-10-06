import { Inject, Injectable } from '@nestjs/common';
import { FriendListService } from 'src/friend-list/friend-list.service';
import { FirstPrivacyOptions } from 'src/privacy/Enums/PrivacyOptions.enum';
import { PrivacyService } from 'src/privacy/privacy.service';
import PrivacyInterface from 'src/privacy/Types/IPrivacyInteface';
import IUploadedFiles from 'src/user/Types/IUploadedFiles';
import { UserData } from 'src/user/userData.entity';
import EPicturePath from 'src/utils/EPicturePath';
import IAccountInfo from './Types/IAccountInfo';
import IBasicInfo from './Types/IBasicInfo';
import IChangeUserInformationInterface from './Types/IChangeUserInformationInterface';
import IContactInfo from './Types/IContactInfo';
import IGetOtherUserInfo from './Types/IGetOtherUserInfo';
import IPersonalInfo from './Types/IPersonalInfo';
import IReturnInfoInterface from './Types/IReturnInfoInterface';
import IUpdateProfile from './Types/IUpdateProfile';
import IUserInformationInterface from './Types/IUserInformationInterface';
import IValidateUserInfoInterface from './Types/IValidateUserInfoInterface';
import { UserInformation } from './user-information.entity';

@Injectable()
export class UserInformationService {
    constructor(
        @Inject(FriendListService) private friendList: FriendListService,
        @Inject(PrivacyService) private privacyService: PrivacyService,
    ) { }

    getUserInfo = async (currentTokenId: string): Promise<IUserInformationInterface> => {
        const { userInformation } = await UserData.findOne({
            relations: ['userInformation'],
            where: {
                currentTokenId
            }
        })

        return userInformation;
    }

    getUserUsername = async (currentTokenId: string): Promise<string> => {
        const { username } = await UserData.findOne({
            relations: ['userInformation'],
            where: {
                currentTokenId
            }
        })

        return username;
    }

    checkIfCanHideFieldValue = (key: string): boolean => key === FirstPrivacyOptions.EVERYONE;

    setNullToTheProfileInfoKey = (key: string, userInfo: IUserInformationInterface): IUserInformationInterface => {
        userInfo[key] = null;

        return userInfo;
    };

    updateEmailAndPhoneValues = async (userInformation: IUserInformationInterface, currentUserData: UserData, username: string): Promise<IUserInformationInterface> => {
        const { id, ...userProfileData } = userInformation;

        const dataWithEmail = await this.privacyService.checkIfUserHaveAccessToThisData(currentUserData, { username }, 'emailAddress') ? userProfileData : this.setNullToTheProfileInfoKey('email', userProfileData);

        const dataWithPhoneNumber = await this.privacyService.checkIfUserHaveAccessToThisData(currentUserData, { username }, 'phoneNumber') ? dataWithEmail : this.setNullToTheProfileInfoKey('phone', dataWithEmail);

        return dataWithPhoneNumber;
    }

    modifyUserProfileDataDependsOfTheUserPrivacySettings = async (userInformation: IUserInformationInterface, currentUserData: UserData, username: string) => {
        const dataWithEmailAndPhoneNumberValidated = await this.updateEmailAndPhoneValues(userInformation, currentUserData, username);

        return dataWithEmailAndPhoneNumberValidated;
    }

    checkIfThisUserContainsInTheFriendList = async (currentUserData: UserData, username: string): Promise<boolean> => {
        const friendList = await this.friendList.getFriendListByUsername({ username: currentUserData.username });

        const doesContain = !!friendList.find(singleFriend => singleFriend.username === username);

        return doesContain;
    }

    getInviteStatus = async (currentUserData: UserData, username: string): Promise<boolean> => {
        const inviteList = await this.friendList.getInviteListByUsername({ username });

        const doesContain = !!inviteList.find(singleInvite => singleInvite.username === currentUserData.username);

        return doesContain;
    }

    getMutualFriendNumber = async (currentUserData: UserData, username: string): Promise<number> => {
        const doesHaveAccess = await this.privacyService.checkIfUserHaveAccessToThisData(currentUserData, { username }, 'friendList');

        if (!doesHaveAccess)
            return 0;

        const currentUserFriendList = await this.friendList.getFriendListByUsername({ username: currentUserData.username });
        const otherUserFriendList = await this.friendList.getFriendListByUsername({ username });

        const sameElementsArray = currentUserFriendList.filter(currentFriend => otherUserFriendList.some(({ username }) => username === currentFriend.username));

        return sameElementsArray.length;
    }

    checkIfCanSendFriendRequest = async (currentUserData: UserData, username: string): Promise<boolean> => {
        const canSend = await this.privacyService.checkIfUserHaveAccessToThisData(currentUserData, { username }, 'friendRequest')

        return canSend
    }

    getOtherUserInfo = async ({ username }: IGetOtherUserInfo, currentUserData: UserData) => {
        const userProfileData = await UserData.findOne({
            relations: ['userInformation', 'userPrivacy'],
            where: {
                username
            }
        });

        if (!userProfileData)
            return {
                isSuccess: false
            }

        const { userInformation, userPrivacy } = userProfileData;

        const modifiedUserProfileData = await this.modifyUserProfileDataDependsOfTheUserPrivacySettings(userInformation, currentUserData, username);

        const validateUserInfo = this.validateUserInfo(modifiedUserProfileData);

        const doesUserContainInFriendList = await this.checkIfThisUserContainsInTheFriendList(currentUserData, username);

        const isThatMyProfile = currentUserData.username === username;

        const inviteStatus = await this.getInviteStatus(currentUserData, username);

        const mutualFriendsNumber = await this.getMutualFriendNumber(currentUserData, username);

        const canSendFriendRequest = await this.checkIfCanSendFriendRequest(currentUserData, username);

        return {
            isSuccess: true,
            userData: {
                ...validateUserInfo,
                isOnFriendList: doesUserContainInFriendList,
                isThatMyProfile,
                inviteStatus,
                mutualFriendsNumber,
                canSendFriendRequest
            }
        }
    }

    setDefaultInformation = async (name: string, lastname: string): Promise<UserInformation> => {
        const newDefaultInfo = new UserInformation();

        newDefaultInfo.name = name;
        newDefaultInfo.lastname = lastname;
        newDefaultInfo.picture = "default-picture.png";

        await newDefaultInfo.save();

        return newDefaultInfo;
    }

    checkHowMuchUsersHaveTheSameCredentials = async (name: string, lastname: string): Promise<number> => await UserInformation.count({ name, lastname });

    changeUserInformation = async ({ user, options }: IChangeUserInformationInterface): Promise<IReturnInfoInterface> => {
        const { currentTokenId } = user;

        const { id } = await this.getUserInfo(currentTokenId);

        const { affected } = await UserInformation.update(id, options);

        if (affected)
            return {
                isSuccess: true,
                affected
            }

        return {
            isSuccess: false,
            affected
        };
    }

    accountInfo = ({ name, lastname, picture, memberSince, lastUpdate }: IUserInformationInterface): IAccountInfo => {
        const picturePath = `${EPicturePath.PICTURE_PATH}${picture}`
        return {
            name,
            lastname,
            picture: picturePath,
            memberSince,
            lastUpdate
        }
    }

    basicInfo = ({ school, status, sex, city, birthday }: IUserInformationInterface): IBasicInfo => {
        return {
            school,
            status,
            sex,
            city,
            birthday
        }
    }

    contactInfo = ({ email, phone }: IUserInformationInterface): IContactInfo => {
        return {
            email,
            phone
        }
    }

    personalInfo = ({ aboutMe, partner, relationshipStatus, lookingFor, interestedIn, favouriteMovies, favouriteMusic, interests }: IUserInformationInterface): IPersonalInfo => {
        return {
            aboutMe,
            favouriteMovies,
            favouriteMusic,
            interestedIn,
            interests,
            lookingFor,
            partner,
            relationshipStatus
        }
    }

    validateUserInfo = (userInfo: IUserInformationInterface): IValidateUserInfoInterface => {
        const accountInfo = this.accountInfo(userInfo);
        const basicInfo = this.basicInfo(userInfo);
        const contactInfo = this.contactInfo(userInfo);
        const personalInfo = this.personalInfo(userInfo);

        return {
            accountInfo,
            basicInfo,
            contactInfo,
            personalInfo
        }
    }

    getValidatedUserInformation = async ({ currentTokenId }: UserData) => {
        const userInfo = await this.getUserInfo(currentTokenId);
        const validateUserInfo = this.validateUserInfo(userInfo);

        return {
            isSuccess: true,
            userData: validateUserInfo
        }
    }

    getAccountInfo = async ({ currentTokenId }: UserData) => {
        const { name, lastname, email } = await this.getUserInfo(currentTokenId);
        const username = await this.getUserUsername(currentTokenId);

        return {
            isSuccess: true,
            userData: {
                name,
                lastname,
                email,
                username
            }
        };
    }

    getProfilePicture = async ({ currentTokenId }: UserData) => {
        const { userInformation } = await UserData.findOne({
            where: {
                currentTokenId
            },
            relations: ['userInformation']
        })

        const { picture } = userInformation;

        return {
            imagePath: `${EPicturePath.PICTURE_PATH}${picture}`
        }
    }

    deleteProfilePicture = async (user: UserData) => {
        const options = {
            picture: 'default-picture.png'
        }

        const result = this.changeUserInformation({ user, options })

        return result;
    }
}