import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { PrivacyService } from './privacy/privacy.service';
import { PrivacyController } from './privacy/privacy.controller';
import { PrivacyModule } from './privacy/privacy.module';
import { UserInformationModule } from './user-information/user-information.module';
import { FriendListController } from './friend-list/friend-list.controller';
import { FriendListService } from './friend-list/friend-list.service';
import { FriendListModule } from './friend-list/friend-list.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    UserSettingsModule,
    PrivacyModule,
    UserInformationModule,
    FriendListModule
  ],
  controllers: [AppController, PrivacyController, FriendListController],
  providers: [AppService, PrivacyService, FriendListService],
})
export class AppModule { }
