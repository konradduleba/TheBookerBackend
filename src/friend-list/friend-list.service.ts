import { Injectable } from '@nestjs/common';
import { UserData } from 'src/user/userData.entity';
import { getConnection } from 'typeorm';
import { FriendInvites } from './friend-invites.entity';
import { FriendList } from './friend-list.entity';
import IFriendList from './Types/IFriendList';
import IInsertValues from './Types/IInsertValues';
import INewFriend from './Types/INewFriend';

@Injectable()
export class FriendListService {
    getUserInformationRequiredToAppendToFriendList = async (username: string) => await UserData.findOne({
        relations: ['userInformation'],
        where: {
            username
        }
    })

    getUserIdByUsername = async (username: string) => await UserData.findOne({
        where: {
            username
        }
    })

    getFriendListByUsername = async ({ username }: INewFriend) => {
        const { friendList } = await UserData.findOne({
            relations: ['friendList'],
            where: {
                username
            }
        })

        return friendList;
    }

    getInviteListByUsername = async ({ username }: INewFriend) => {
        const { friendInvites } = await UserData.findOne({
            relations: ['friendInvites'],
            where: {
                username
            }
        })

        return friendInvites;
    }

    getFriendList = async ({ id }: UserData): Promise<IFriendList[]> => {
        const { friendList } = await UserData.findOne({
            relations: ['friendList'],
            where: {
                id
            }
        })

        return friendList;
    }

    getInviteList = async ({ id }: UserData): Promise<IFriendList[]> => {
        const { friendInvites } = await UserData.findOne({
            relations: ['friendInvites'],
            where: {
                id
            }
        })

        return friendInvites;
    }

    getInviteListById = async (id: string): Promise<IFriendList[]> => {
        const { friendInvites } = await UserData.findOne({
            relations: ['friendInvites'],
            where: {
                id
            }
        })

        return friendInvites;
    }

    getFriendId = async (username: string) => {
        const userInfo = await this.getUserInformationRequiredToAppendToFriendList(username);

        if (!userInfo)
            return null;

        const { id } = await FriendList.findOne({
            where: {
                username
            }
        })

        return id;
    }

    getInviteFriendId = async (username: string) => {
        const userInfo = await this.getUserInformationRequiredToAppendToFriendList(username);

        if (!userInfo)
            return null;

        const { id } = await FriendInvites.findOne({
            where: {
                username
            }
        })

        return id;
    }

    deleteUserFromSelectedTable = async (tableName: string, where: string, values: IInsertValues) => await getConnection()
        .createQueryBuilder()
        .delete()
        .from(tableName)
        .where(where, values)
        .execute();

    removeUserFromFriendList = async (userData: UserData, { username }: INewFriend) => {
        const { id } = userData;

        const friendUserId = await this.getFriendId(username);

        const userFriendList = await this.getFriendList(userData);

        const result = userFriendList.find(singleFriend => singleFriend.username === username);

        if (!result)
            return {
                isSuccess: false,
                message: 'This user is not anymore on your friend list'
            }

        const whereSyntax = 'userDataId = :id AND friendListId = :friendUserId';

        const values = {
            id,
            friendUserId
        }

        const actualUserIdFromFriendList = await this.getFriendId(userData.username);

        const friendId = await this.getUserIdByUsername(username);

        const secondValues = {
            id: friendId.id,
            friendUserId: actualUserIdFromFriendList
        }

        console.log(values, secondValues);

        this.deleteUserFromSelectedTable('user_data_friend_list_friend_list', whereSyntax, values);
        this.deleteUserFromSelectedTable('user_data_friend_list_friend_list', whereSyntax, secondValues);

        return {
            isSuccess: true,
            message: 'User have been deleted'
        }
    }

    insertIntoSelectedTableValues = async (tableName: string, values: IInsertValues) => await getConnection()
        .createQueryBuilder()
        .insert()
        .into(tableName)
        .values(values)
        .execute();

    addNewFriend = async (userData: UserData, { username }: INewFriend) => {
        const { id, username: senderUsername } = userData;

        const friendUserId = await this.getFriendId(username);

        const inviteUserId = await this.getInviteFriendId(username);

        const userFriendList = await this.getFriendList(userData);

        const result = userFriendList.find(singleFriend => singleFriend.username === username);

        if (result)
            return {
                isSuccess: false,
                message: 'This user already contains on your friend list'
            }

        const values = {
            userDataId: id,
            friendListId: friendUserId
        }

        this.insertIntoSelectedTableValues('user_data_friend_list_friend_list', values);

        const { id: acceptFriendId } = await this.getUserIdByUsername(username);

        const senderUserId = await this.getFriendId(senderUsername);

        const secondValues = {
            userDataId: acceptFriendId,
            friendListId: senderUserId
        }

        this.insertIntoSelectedTableValues('user_data_friend_list_friend_list', secondValues);

        const whereSyntax = 'userDataId = :id AND friendInvitesId = :inviteUserId';

        const deleteUserValues = {
            id,
            inviteUserId
        }

        this.deleteUserFromSelectedTable('user_data_friend_invites_friend_invites', whereSyntax, deleteUserValues);

        return {
            isSuccess: true,
            message: 'Added new friend'
        };
    }

    inviteUserToTheFriendList = async (userData: UserData, { username }: INewFriend) => {
        const { username: senderUsername } = userData;

        const { id } = await this.getUserIdByUsername(username);

        const friendUserId = await this.getInviteFriendId(senderUsername);

        const userInviteList = await this.getInviteListById(id);

        const userFriendList = await this.getFriendList(userData);

        const doesUserContainInFriendList = userFriendList.find(singleFriend => singleFriend.username === username);

        if (doesUserContainInFriendList)
            return {
                isSuccess: false,
                message: 'This user is already on your friend list'
            }

        const result = userInviteList.find(singleFriend => singleFriend.username === senderUsername);

        if (result)
            return {
                isSuccess: false,
                message: 'Invite have been already sended'
            }

        const values = {
            userDataId: id,
            friendInvitesId: friendUserId
        }

        this.insertIntoSelectedTableValues('user_data_friend_invites_friend_invites', values);

        return {
            isSuccess: true,
            message: 'Invite sended'
        };
    }

    deleteUserFromInviteList = async (userData: UserData, { username }: INewFriend) => {
        const { id } = userData;

        const inviteUserId = await this.getInviteFriendId(username);

        const userInviteList = await this.getInviteList(userData);

        const result = userInviteList.find(singleInvite => singleInvite.username === username);

        if (!result)
            return {
                isSuccess: false,
                message: 'This user is not anymore on your invite list'
            }

        const whereSyntax = 'userDataId = :id AND friendInvitesId = :inviteUserId';

        const values = {
            id,
            inviteUserId
        }

        this.deleteUserFromSelectedTable('user_data_friend_invites_friend_invites', whereSyntax, values);

        return {
            isSuccess: true,
            message: 'User have been deleted'
        }
    }
}
