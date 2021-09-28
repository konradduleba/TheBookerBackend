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
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    UserSettingsModule,
    PrivacyModule,
    UserInformationModule,
    FriendListModule,
    SearchModule,
    SearchModule
  ],
  controllers: [AppController, PrivacyController, FriendListController, SearchController],
  providers: [AppService, PrivacyService, FriendListService, SearchService],
})
export class AppModule { }
