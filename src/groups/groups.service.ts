import { Injectable } from '@nestjs/common';
import IInsertValues from 'src/friend-list/Types/IInsertValues';
import { GroupPosts } from 'src/group-posts/groupPosts.entity';
import IGroupPosts from 'src/group-posts/Types/IGroupPosts';
import { PostComments } from 'src/post-comments/post-comments.entity';
import { UserData } from 'src/user/userData.entity';
import EPicturePath from 'src/utils/EPicturePath';
import { getConnection } from 'typeorm';
import { Groups } from './groups.entity';
import ICreateGroup from './Types/ICreateGroup';
import IGetAllFromSelectedGroup from './Types/IGetAllFromSelectedGroup';
import IGroupList from './Types/IGroupList';
import IKickUserFromTheGroup from './Types/IKickUserFromTheGroup';

@Injectable()
export class GroupsService {
    findGroup = async (name: string): Promise<Groups> => await Groups.findOne({
        name
    })

    getGroupList = async ({ id }: UserData): Promise<IGroupList[]> => {
        const { groupList } = await UserData.findOne({
            relations: ['groupList'],
            where: {
                id
            }
        })

        return groupList.map(singleGroup => {
            const { picture } = singleGroup;
            return {
                ...singleGroup,
                picture: `${EPicturePath.PICTURE_PATH}${picture}`
            }
        });
    }

    doesUserContainSelectedGroup = async (username: string, groupId: string): Promise<boolean> => {
        const { groupList } = await UserData.findOne({
            relations: ['groupList'],
            where: {
                username
            }
        })

        const doesContain = groupList.find(({ id }) => id === groupId)

        return !!doesContain
    }

    addUserToTheSelectedGroup = async (user: UserData, groupName: string) => {
        const userDataId: string = user.id;

        const groupList = await this.getGroupList(user)

        const result = groupList.find(singleGroup => singleGroup.name === groupName);

        if (result)
            return {
                isSuccess: false,
                message: 'This user is already on this group'
            }

        const selectedGroup = await this.findGroup(groupName);

        if (!selectedGroup)
            return {
                isSuccess: false,
                message: 'Group not found'
            }

        const groupsId: string = selectedGroup.id;

        const options = {
            userDataId,
            groupsId
        }

        this.insertIntoSelectedTableValues('user_data_group_list_groups', options);

        return {
            isSuccess: true,
            message: 'User have been added to the group'
        }
    }

    removeUserFromSelectedGroup = async (user: UserData, groupName: string) => {
        const userDataId: string = user.id;

        const groupList = await this.getGroupList(user)

        const result = groupList.find(singleGroup => singleGroup.name === groupName);

        if (!result)
            return {
                isSuccess: false,
                message: 'This user is not contained in this group'
            }

        const selectedGroup = await this.findGroup(groupName);

        if (!selectedGroup)
            return {
                isSuccess: false,
                message: 'Group not found'
            }

        const groupsId: string = selectedGroup.id;

        const options = {
            userDataId,
            groupsId
        }

        const whereSyntax = 'userDataId = :userDataId AND groupsId = :groupsId';

        this.deleteUserFromSelectedTable('user_data_group_list_groups', whereSyntax, options);

        return {
            isSuccess: true,
            message: 'User have been deleted from the group'
        }
    }

    deleteUserFromSelectedTable = async (tableName: string, where: string, values: IInsertValues) => await getConnection()
        .createQueryBuilder()
        .delete()
        .from(tableName)
        .where(where, values)
        .execute();

    createGroup = async (user: UserData, options: ICreateGroup) => {
        const { description, name } = options;

        const isNameAvailable = await this.findGroup(name);

        if (isNameAvailable)
            return {
                isSuccess: false,
                message: 'Group with this name is already created'
            }

        const newGroup = new Groups();

        newGroup.name = name;
        newGroup.description = description;
        newGroup.picture = 'default-picture.png';
        newGroup.owner = user.id;

        newGroup.save()

        return {
            isSuccess: true,
            message: 'Group have been created'
        }
    }

    insertIntoSelectedTableValues = async (tableName: string, values: IInsertValues) => await getConnection()
        .createQueryBuilder()
        .insert()
        .into(tableName)
        .values(values)
        .execute();

    getUsersIdFromSelectedGroup = async (groupId: string) => await getConnection()
        .createQueryBuilder()
        .select("userDataId")
        .from("user_data_group_list_groups", "groups")
        .where("groupsId = :groupId", { groupId: groupId })
        .execute()

    kickUserFromTheGroup = async ({ id }: UserData, { username, groupName }: IKickUserFromTheGroup) => {
        const groupData = await this.findGroup(groupName);

        if (!groupData)
            return {
                isSuccess: false,
                message: "Group with this name doesn't exists"
            }

        const { owner } = groupData;

        if (owner !== id)
            return {
                isSuccess: false,
                message: "You're not the owner of the group"
            }

        const doesUserContainInTheGroup = await this.doesUserContainSelectedGroup(username, groupName);

        if (!doesUserContainInTheGroup)
            return {
                isSuccess: false,
                message: "User is not in this group"
            }

        const groupsId: string = groupData.id;

        const options = {
            userDataId: id,
            groupsId
        }

        const whereSyntax = 'userDataId = :userDataId AND groupsId = :groupsId';

        this.deleteUserFromSelectedTable('user_data_group_list_groups', whereSyntax, options);

        return {
            isSuccess: true,
            message: 'User have been deleted from the group'
        }
    }

    getUserDataBySelectedId = async (id: string) => await UserData.findOne({
        relations: ['userInformation'],
        where: {
            id
        }
    })

    getAllUserFromSelectedGroup = async ({ groupName }: IGetAllFromSelectedGroup) => {
        const groupData = await this.findGroup(groupName);

        if (!groupData)
            return {
                isSuccess: false,
                message: "Group with this name doesn't exists"
            }

        const { id } = groupData;

        const usersIdList = await this.getUsersIdFromSelectedGroup(id);

        const promises = usersIdList.map(async ({ userDataId }) => await this.getUserDataBySelectedId(userDataId))

        const usersData = await Promise.all(promises);

        return usersData.map(({ userInformation, username }) => {
            const { name, lastname, picture } = userInformation;

            return {
                username,
                name,
                lastname,
                picture: `${EPicturePath.PICTURE_PATH}${picture}`
            }
        })
    }

    getGroupPosts = async (groupData: Groups) => await GroupPosts.find({ group: groupData });

    getPostComments = async (postData: GroupPosts) => await PostComments.find({ post: postData });

    modifyCommentData = (commentData: PostComments[]) => {
        const filteredComments = commentData.filter(({ isActive }) => isActive);

        return filteredComments.map(comment => {
            const { authorLastname, authorName, authorUsername, content, date, id } = comment;

            return {
                id,
                date,
                content,
                author: {
                    name: authorName,
                    lastname: authorLastname,
                    username: authorUsername
                }
            }
        })
    }

    modifyPostData = async (posts: GroupPosts[]) => {
        const filteredArray = posts.filter(({ isActive }) => isActive)

        const commentPromises = filteredArray.map(async postData => {
            const { id } = postData;

            return {
                id,
                commentData: await this.getPostComments(postData)
            }
        })

        const allComments = await Promise.all(commentPromises);

        return filteredArray.map(groupPost => {
            const { authorLastname, authorName, authorUsername, content, date, title, id } = groupPost;

            return {
                id,
                date,
                title,
                content,
                author: {
                    name: authorName,
                    lastname: authorLastname,
                    username: authorUsername
                },
                comments: allComments.filter(singleComment => singleComment.id === id).map(({ commentData }) => this.modifyCommentData(commentData))[0]
            }
        })
    }

    getOwnerData = async (user: UserData, id: string) => {
        const { userInformation, username } = await UserData.findOne({
            relations: ['userInformation'],
            where: {
                id
            }
        })

        const isThatMe = user.id === id;

        const { name, lastname } = userInformation;

        return {
            name,
            lastname,
            username,
            isThatMe
        }
    }

    getGroupInfo = async (user: UserData, { groupName }: IGetAllFromSelectedGroup) => {
        const groupData = await this.findGroup(groupName);

        if (!groupData)
            return {
                isSuccess: false,
                message: "Group with this name doesn't exists"
            }

        const { name, description, owner, picture } = groupData;

        const posts = await this.getGroupPosts(groupData);

        return {
            name,
            description,
            picture: `${EPicturePath.PICTURE_PATH}${picture}`,
            owner: await this.getOwnerData(user, owner),
            posts: await this.modifyPostData(posts),
            belong: await this.doesUserContainSelectedGroup(user.username, groupData.id),
        }
    }
}
