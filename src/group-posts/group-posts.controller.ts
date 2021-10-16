import { Body, Controller, Delete, Inject, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserObj } from 'src/decorators/userobj.decorator';
import { UserData } from 'src/user/userData.entity';
import { GroupPostsService } from './group-posts.service';
import IComment from './Types/IComment';
import ICreatePost from './Types/ICreatePost';
import IDeleteComment from './Types/IDeleteComment';
import IDeletePost from './Types/IDeletePost';
import IEditComment from './Types/IEditComment';
import IEditPost from './Types/IEditPost';

@Controller('group-posts')
export class GroupPostsController {
    constructor(
        @Inject(GroupPostsService) private groupPostsService: GroupPostsService
    ) { }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    CreatePost(
        @UserObj() user: UserData,
        @Body() options: ICreatePost,
    ) {
        return this.groupPostsService.createPostToTheSelectedGroup(user, options)
    }

    @Delete('/delete')
    @UseGuards(JwtAuthGuard)
    DeletePost(
        @UserObj() user: UserData,
        @Body() options: IDeletePost
    ) {
        return this.groupPostsService.deleteSelectedPost(user, options);
    }

    @Patch('/edit')
    @UseGuards(JwtAuthGuard)
    EditPost(
        @UserObj() user: UserData,
        @Body() options: IEditPost,
    ) {
        return this.groupPostsService.editSelectedPostContent(user, options)
    }

    @Post('/comment')
    @UseGuards(JwtAuthGuard)
    CreateComment(
        @UserObj() user: UserData,
        @Body() options: IComment,
    ) {
        return this.groupPostsService.checkIfCanCreateComment(user, options);
    }

    @Patch('/comment')
    @UseGuards(JwtAuthGuard)
    EditComment(
        @UserObj() user: UserData,
        @Body() options: IEditComment
    ) {
        return this.groupPostsService.editComment(user, options)
    }

    @Delete('/comment')
    @UseGuards(JwtAuthGuard)
    DeleteComment(
        @UserObj() user: UserData,
        @Body() options: IDeleteComment
    ) {
        return this.groupPostsService.deleteComment(user, options)
    }
}
