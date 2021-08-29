import { Module } from '@nestjs/common';
import { UserInformationService } from './user-information.service';
import { UserInformationController } from './user-information.controller';
import { FriendListService } from 'src/friend-list/friend-list.service';

@Module({
  providers: [UserInformationService, FriendListService],
  controllers: [UserInformationController],
  exports: [UserInformationService]
})
export class UserInformationModule { }
