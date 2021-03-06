import { Module } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { FriendListService } from 'src/friend-list/friend-list.service';
import { PrivacyService } from 'src/privacy/privacy.service';
import { UserInformationService } from 'src/user-information/user-information.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [AuthService, PrivacyService],
  controllers: [UserController],
  providers: [UserService, PrivacyService, AuthService, UserInformationService, FriendListService],
  exports: [UserService]
})
export class UserModule { }
