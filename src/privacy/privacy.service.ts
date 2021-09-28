import { Injectable } from '@nestjs/common';
import IFriendList from 'src/friend-list/Types/IFriendList';
import INewFriend from 'src/friend-list/Types/INewFriend';
import UserDataInterface from 'src/user/dto/UserDataInterface.dto';
import { UserData } from 'src/user/userData.entity';
import { FirstPrivacyOptions, SecondPrivacyOptions } from './Enums/PrivacyOptions.enum';
import { Privacy } from './privacy.entity';
import IChangePrivacySettingsInterface from './Types/IChangePrivacySettingsInterface';
import IPrivacyInterface from './Types/IPrivacyInteface';
import IReturnPrivacyInfoInterface from './Types/IReturnPrivacyInfoInterface';
import IValidatedPrivacyDataInterface from './Types/IValidatedPrivacyDataInterface';

@Injectable()
export class PrivacyService {
    getUserPrivacyInfo = async (currentTokenId: string): Promise<IPrivacyInterface> => {
        const { userPrivacy } = await UserData.findOne({
            relations: ['userPrivacy'],
            where: {
                currentTokenId
            }
        })

        return userPrivacy;
    }

    setDefaultPrivacySettings = async (): Promise<Privacy> => {
        const defaultPrivacySettings = new Privacy();

        await defaultPrivacySettings.save();

        return defaultPrivacySettings;
    }

    checkIfCanSendFriendRequest = async (currentUsername: string, selectedUserFriendList: IFriendList[]): Promise<boolean> => {
        const { friendList } = await UserData.findOne({
            relations: ['friendList'],
            where: {
                username: currentUsername
            }
        })

        const isIncluded = selectedUserFriendList.filter(({ username }) => friendList.find(friend => friend.username === username))

        return !!isIncluded.length;
    }

    checkIfUserHaveAccessToThisData = async (currentUser: UserData, { username }: INewFriend, property: string): Promise<boolean> => {
        const { userPrivacy, friendList } = await UserData.findOne({
            relations: ['userPrivacy', 'friendList'],
            where: {
                username
            }
        })

        if (property === 'friendRequest') {
            if (userPrivacy[property] === SecondPrivacyOptions.FRIENDS_OF_FRIENDS) {
                const canSend = this.checkIfCanSendFriendRequest(currentUser.username, friendList)

                return canSend;
            }

            return true;
        }

        if (userPrivacy[property] === FirstPrivacyOptions.ONLY_ME)
            return false;
        else if (userPrivacy[property] === FirstPrivacyOptions.MY_FRIENDS) {
            const isCurrentUserOnTheFriendList = friendList.find(({ username }) => username === currentUser.username);

            return !!isCurrentUserOnTheFriendList;
        }

        return true;
    }

    changeUserPrivacySettings = async ({ user, options }: IChangePrivacySettingsInterface): Promise<IReturnPrivacyInfoInterface> => {
        const { currentTokenId } = user;

        const { id } = await this.getUserPrivacyInfo(currentTokenId);

        const { affected } = await Privacy.update(id, options);

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

    validateUserPrivacyData = (userPrivacy: IPrivacyInterface): IValidatedPrivacyDataInterface => {
        const { id, ...privacyInfo } = userPrivacy;
        return privacyInfo;
    }

    getUserPrivacySettings = async ({ currentTokenId }: UserDataInterface): Promise<IReturnPrivacyInfoInterface> => {
        const { id } = await this.getUserPrivacyInfo(currentTokenId);

        const userPrivacyData = await Privacy.findOne({ id });

        const privacyInfo = this.validateUserPrivacyData(userPrivacyData);

        return {
            isSuccess: true,
            privacyInfo
        }
    }
}
