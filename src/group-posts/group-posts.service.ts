import { Injectable } from '@nestjs/common';
import { Groups } from 'src/groups/groups.entity';
import { PostComments } from 'src/post-comments/post-comments.entity';
import ICreateComment from 'src/post-comments/Types/ICreateComment';
import { UserData } from 'src/user/userData.entity';
import { GroupPosts } from './groupPosts.entity';
import IComment from './Types/IComment';
import ICreatePost from './Types/ICreatePost';
import IDeleteComment from './Types/IDeleteComment';
import IDeletePost from './Types/IDeletePost';
import IEditComment from './Types/IEditComment';
import IEditPost from './Types/IEditPost';

@Injectable()
export class GroupPostsService {
    getUserDataBySelectedId = async (id: string) => await UserData.findOne({
        relations: ['userInformation'],
        where: {
            id
        }
    })

    checkIfUserIsInThisGroup = async (id: string, groupName: string): Promise<boolean> => {
        const { groupList } = await UserData.findOne({
            relations: ['groupList'],
            where: {
                id
            }
        })

        const doesContain = groupList.find(({ name }) => name === groupName)

        return !!doesContain;
    }

    getGroupData = async (groupName: string): Promise<Groups> => await Groups.findOne({ name: groupName });

    getUserInformation = async (id: string) => await UserData.findOne({
        relations: ['userInformation'],
        where: {
            id
        }
    })

    getPostInformation = async (id: string) => await GroupPosts.findOne({ id })

    getCommentInformation = async (id: string) => await PostComments.findOne({ id })

    createPostToTheSelectedGroup = async ({ id }: UserData, options: ICreatePost) => {
        const { title, groupName, content } = options;
        const { userInformation, username } = await this.getUserInformation(id)
        const { name, lastname } = userInformation;

        const isUserInThisGroup = await this.checkIfUserIsInThisGroup(id, groupName);

        if (!isUserInThisGroup)
            return {
                isSuccess: false,
                message: 'User is not in this group'
            }

        const newPost = new GroupPosts()

        newPost.title = title;
        newPost.authorName = name;
        newPost.authorLastname = lastname;
        newPost.group = await this.getGroupData(groupName);
        newPost.content = content;
        newPost.authorUsername = username;
        newPost.authorId = id;
        newPost.isActive = true;

        newPost.save();

        return {
            isSuccess: true,
            message: 'Post have been created'
        }
    }

    checkIfCanDeletePost = async ({ id }: UserData, postId: string, owner): Promise<boolean> => {
        const { authorId } = await this.getPostInformation(postId);

        return authorId === id || authorId === owner;
    }

    deleteSelectedPost = async (user: UserData, { id, groupName }: IDeletePost) => {
        const isUserInThisGroup = await this.checkIfUserIsInThisGroup(user.id, groupName);
        const { owner } = await this.getGroupData(groupName);

        if (!isUserInThisGroup)
            return {
                isSuccess: false,
                message: 'User is not in this group'
            }

        const canDelete = this.checkIfCanDeletePost(user, id, owner);

        if (!canDelete)
            return {
                isSuccess: false,
                message: "You don't have permission to do that"
            }

        const { affected } = await GroupPosts.update(id, { isActive: false })

        return {
            isSuccess: !!affected
        }
    }

    editSelectedPostContent = async (user: UserData, options: IEditPost) => {
        const { groupName, id, content, title } = options;

        const isUserInThisGroup = await this.checkIfUserIsInThisGroup(user.id, groupName);

        if (!isUserInThisGroup)
            return {
                isSuccess: false,
                message: 'User is not in this group'
            }

        const { affected } = await GroupPosts.update(id, {
            title,
            content
        })

        return {
            isSuccess: !!affected
        }
    }

    createComment = async ({ id }: UserData, { content, postData }: ICreateComment) => {
        const { userInformation, username } = await this.getUserDataBySelectedId(id);
        const { name, lastname } = userInformation;

        const newComment = new PostComments();

        newComment.authorName = name;
        newComment.authorLastname = lastname;
        newComment.authorUsername = username;
        newComment.content = content;
        newComment.isActive = true;
        newComment.authorId = id;
        newComment.post = postData;

        newComment.save();
    }

    checkIfCanCreateComment = async (user: UserData, { groupName, id, content }: IComment) => {
        const isUserInThisGroup = await this.checkIfUserIsInThisGroup(user.id, groupName);

        if (!isUserInThisGroup)
            return {
                isSuccess: false,
                message: 'User is not in this group'
            }

        const postData = await this.getPostInformation(id);

        if (!postData)
            return {
                isSuccess: false,
                message: "Post doesn't exists"
            }

        this.createComment(user, {
            content,
            postData
        })

        return {
            isSuccess: true,
            message: 'Comment have been created'
        }
    }

    checkIfUserCanDoOperations = async (user: UserData, { groupName, postId }: IEditComment | IDeleteComment) => {
        const isUserInThisGroup = await this.checkIfUserIsInThisGroup(user.id, groupName);

        if (!isUserInThisGroup)
            return {
                isSuccess: false,
                message: 'User is not in this group'
            }

        const postData = await this.getPostInformation(postId);

        if (!postData)
            return {
                isSuccess: false,
                message: "Post doesn't exists"
            }

        return {
            isSuccess: true
        };
    }

    editComment = async (user: UserData, options: IEditComment) => {
        const canUserDoOperations = await this.checkIfUserCanDoOperations(user, options);

        const { commentId, content } = options;

        const { isSuccess } = canUserDoOperations;

        if (!isSuccess) {
            return canUserDoOperations
        }

        const commentInfo = await this.getCommentInformation(commentId)

        if (!commentInfo) {
            return {
                isSuccess: false,
                message: "Comment doesn't exists"
            }
        }

        const { authorId } = commentInfo;

        if (authorId !== user.id) {
            return {
                isSuccess: false,
                message: "You're not the author"
            }
        }

        const { affected } = await PostComments.update(commentId, {
            content
        })

        return {
            isSuccess: !!affected
        }
    }

    deleteComment = async (user: UserData, options: IDeleteComment) => {
        const canUserDoOperations = await this.checkIfUserCanDoOperations(user, options);

        const { isSuccess } = canUserDoOperations;

        if (!isSuccess) {
            return canUserDoOperations
        }

        const { commentId } = options;

        const commentInfo = await this.getCommentInformation(commentId)

        if (!commentInfo) {
            return {
                isSuccess: false,
                message: "Comment doesn't exists"
            }
        }

        const { authorId } = commentInfo;

        if (authorId !== user.id) {
            return {
                isSuccess: false,
                message: "You're not the author"
            }
        }

        const { affected } = await PostComments.update(commentId, {
            isActive: false
        })

        return {
            isSuccess: !!affected
        }
    }
}
