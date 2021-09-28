import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { FriendListService } from 'src/friend-list/friend-list.service';
import { PrivacyService } from 'src/privacy/privacy.service';

@Module({
  imports: [PrivacyService],
  providers: [UserInformationService, FriendListService, PrivacyService],
  controllers: [UserInformationController],
  exports: [UserInformationService]
})
export class UserInformationModule { }
