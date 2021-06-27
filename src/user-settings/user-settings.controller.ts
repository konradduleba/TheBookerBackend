import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import AddUserRole from './dto/addUserRole.dts';
import { UserSettingsService } from './user-settings.service';

@Controller('user-settings')
export class UserSettingsController {
    constructor(
        @Inject(UserSettingsService) private userSettingsService: UserSettingsService,
    ) { }

    @Post('/add-role')
    @UseGuards(AuthGuard('jwt'))
    AddUserRole(
        @Body() userRole: AddUserRole
    ) {
        return this.userSettingsService.addUserRole(userRole);
    }
}
