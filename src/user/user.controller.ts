import { Body, Controller, Get, Inject, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { AuthLoginDto } from 'src/auth/dto/AuthLoginDto.dto';
import { UserObj } from 'src/decorators/userobj.decorator';
import { PrivacyService } from 'src/privacy/privacy.service';
import ChangePrivacyOptionsInterface from './dto/ChangePrivacyOptionsInterface.dto';
import InputUserRole from './dto/InputUserRole.dto';
import UserRegistration from './dto/UserRegistration.dto';
import { UserService } from './user.service';
import { UserData } from './userData.entity';
import { Response } from 'express';
import { UserInformationService } from 'src/user-information/user-information.service';
import IUpdateUserInformation from './dto/IUpdateUserInformation';
import IUsername from './Types/IUsername';
import IPassword from './Types/IPassword';
import IDeactivateData from './Types/IDeactivateData';
import IGetOtherUserInfo from 'src/user-information/Types/IGetOtherUserInfo';

@Controller('user')
export class UserController {
    constructor(
        @Inject(UserService) private userService: UserService,
        @Inject(PrivacyService) private privacyService: PrivacyService,
        @Inject(UserInformationService) private userInformationService: UserInformationService,
        @Inject(AuthService) private authService: AuthService,
    ) { }

    @Post('/register')
    RegisterUser(
        @Body() newUser: UserRegistration,
    ) {
        return this.userService.createUser(newUser);
    }

    @Post('/login')
    async phoneRegister(
        @Body() req: AuthLoginDto,
        @Res() res: Response,
    ): Promise<any> {
        return this.authService.login(req, res);
    }

    @Get('/logout')
    @UseGuards(AuthGuard('jwt'))
    async logout(@UserObj() user: UserData, @Res() res: Response) {
        return this.authService.logout(user, res);
    }

    @Get('/role')
    @UseGuards(AuthGuard('jwt'))
    GetUserData(
        @UserObj() user: UserData,
    ) {
        return this.userService.getUserData(user);
    }

    @Get('/privacy')
    @UseGuards(AuthGuard('jwt'))
    GetUserPrivacySettings(
        @UserObj() user: UserData
    ) {
        return this.privacyService.getUserPrivacySettings(user);
    }

    @Patch('/privacy')
    @UseGuards(AuthGuard('jwt'))
    ChangeUserPrivacySettings(
        @UserObj() user: UserData,
        @Body() options: ChangePrivacyOptionsInterface
    ) {
        return this.privacyService.changeUserPrivacySettings({ user, options });
    }

    @Get('/account-info')
    @UseGuards(AuthGuard('jwt'))
    GetUserAccountInfo(
        @UserObj() user: UserData
    ) {
        return this.userInformationService.getAccountInfo(user);
    }

    @Get('/profile')
    @UseGuards(AuthGuard('jwt'))
    GetOtherUserInfo(
        @Body() username: IGetOtherUserInfo
    ) {
        return this.userInformationService.getOtherUserInfo(username);
    }

    @Get('/information')
    @UseGuards(AuthGuard('jwt'))
    GetUserInformation(
        @UserObj() user: UserData
    ) {
        return this.userInformationService.getValidatedUserInformation(user);
    }

    @Patch('/information')
    @UseGuards(AuthGuard('jwt'))
    ChangeUserInformation(
        @UserObj() user: UserData,
        @Body() options: IUpdateUserInformation
    ) {
        return this.userInformationService.changeUserInformation({ user, options });
    }

    //dodać rolę admina (guard)
    @Patch('/user-role')
    @UseGuards(AuthGuard('jwt'))
    ChangeUserRole(
        @UserObj() user: UserData,
        @Body() role: InputUserRole,
    ) {
        return this.userService.changeUserRole(user, role);
    }

    @Patch('/username')
    @UseGuards(AuthGuard('jwt'))
    ChangeUsername(
        @UserObj() user: UserData,
        @Body() username: IUsername,
    ) {
        return this.userService.changeUsername(user, username);
    }

    @Patch('/password')
    @UseGuards(AuthGuard('jwt'))
    ChangePassword(
        @UserObj() user: UserData,
        @Body() password: IPassword,
    ) {
        return this.userService.changePassword(user, password);
    }

    @Post('/deactivate')
    @UseGuards(AuthGuard('jwt'))
    DeactivateUser(
        @UserObj() user: UserData,
        @Body() deactivateData: IDeactivateData,
    ) {
        return this.userService.deactivateUser(user, deactivateData);
    }
}
