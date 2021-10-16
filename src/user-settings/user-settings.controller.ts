import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import AddUserRole from './dto/addUserRole.dts';
import { UserSettingsService } from './user-settings.service';

@Controller('user-settings')
export class UserSettingsController {
    constructor(
        @Inject(UserSettingsService) private userSettingsService: UserSettingsService,
    ) { }

    @Post('/add-role')
    @UseGuards(JwtAuthGuard)
    AddUserRole(
        @Body() userRole: AddUserRole
    ) {
        return this.userSettingsService.addUserRole(userRole);
    }
}
