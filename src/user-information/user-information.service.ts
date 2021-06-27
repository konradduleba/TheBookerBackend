import { Injectable } from '@nestjs/common';
import { UserData } from 'src/user/userData.entity';
import IAccountInfo from './Types/IAccountInfo';
import IBasicInfo from './Types/IBasicInfo';
import IChangeUserInformationInterface from './Types/IChangeUserInformationInterface';
import IContactInfo from './Types/IContactInfo';
import IPersonalInfo from './Types/IPersonalInfo';
import IReturnInfoInterface from './Types/IReturnInfoInterface';
import IUserInformationInterface from './Types/IUserInformationInterface';
import IValidateUserInfoInterface from './Types/IValidateUserInfoInterface';
import { UserInformation } from './user-information.entity';

@Injectable()
export class UserInformationService {
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

    setDefaultInformation = async (name: string, lastname: string): Promise<UserInformation> => {
        const newDefaultInfo = new UserInformation();

        newDefaultInfo.name = name;
        newDefaultInfo.lastname = lastname;
        newDefaultInfo.picture = "https://i.pinimg.com/564x/5c/a1/42/5ca142d34fd1903773b4f4e6f43d9045.jpg";

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
        return {
            name,
            lastname,
            picture,
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
        const validateUserInfo = this.validateUserInfo(userInfo)

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
}