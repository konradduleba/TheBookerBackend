import { Body, Controller, Delete, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserObj } from 'src/decorators/userobj.decorator';
import { UserData } from 'src/user/userData.entity';
import { GroupsService } from './groups.service';
import ICreateGroup from './Types/ICreateGroup';
import IGetAllFromSelectedGroup from './Types/IGetAllFromSelectedGroup';
import IJoinToGroup from './Types/IJoinToGroup';
import IKickUserFromTheGroup from './Types/IKickUserFromTheGroup';

@Controller('groups')
export class GroupsController {
    constructor(
        @Inject(GroupsService) private groupsService: GroupsService
    ) { }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    async CreateGroup(
        @UserObj() user: UserData,
        @Body() options: ICreateGroup
    ) {
        const result = await this.groupsService.createGroup(user, options);

        const { isSuccess } = result;

        if (!isSuccess)
            return result;

        return this.groupsService.addUserToTheSelectedGroup(user, options.name);
    }

    @Get('/info')
    @UseGuards(JwtAuthGuard)
    GetGroupInfo(
        @UserObj() user: UserData,
        @Body() options: IGetAllFromSelectedGroup
    ) {
        return this.groupsService.getGroupInfo(user, options)
    }

    @Post('/join-to-group')
    @UseGuards(JwtAuthGuard)
    JoinToGroup(
        @UserObj() user: UserData,
        @Body() options: IJoinToGroup,
    ) {
        return this.groupsService.addUserToTheSelectedGroup(user, options.groupName)
    }

    @Post('/leave-group')
    @UseGuards(JwtAuthGuard)
    LeaveGroup(
        @UserObj() user: UserData,
        @Body() options: IJoinToGroup,
    ) {
        return this.groupsService.removeUserFromSelectedGroup(user, options.groupName)
    }

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    FindUsersGroups(
        @UserObj() user: UserData
    ) {
        return this.groupsService.getGroupList(user)
    }

    @Get('/all-users-from-selected-group')
    @UseGuards(JwtAuthGuard)
    GetAllUserFromSelectedGroup(
        @Body() options: IGetAllFromSelectedGroup
    ) {
        return this.groupsService.getAllUserFromSelectedGroup(options)
    }

    @Delete('/user-from-group')
    @UseGuards(JwtAuthGuard)
    KickUserFromTheGroup(
        @UserObj() user: UserData,
        @Body() options: IKickUserFromTheGroup
    ) {
        return this.groupsService.kickUserFromTheGroup(user, options)
    }
}
