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
import { GroupsController } from './groups/groups.controller';
import { GroupsService } from './groups/groups.service';
import { GroupsModule } from './groups/groups.module';
import { GroupPostsController } from './group-posts/group-posts.controller';
import { GroupPostsService } from './group-posts/group-posts.service';
import { GroupPostsModule } from './group-posts/group-posts.module';
import { PostCommentsController } from './post-comments/post-comments.controller';
import { PostCommentsService } from './post-comments/post-comments.service';
import { PostCommentsModule } from './post-comments/post-comments.module';

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
    SearchModule,
    GroupsModule,
    GroupPostsModule,
    PostCommentsModule
  ],
  controllers: [AppController, PrivacyController, FriendListController, SearchController, GroupsController, GroupPostsController, PostCommentsController],
  providers: [AppService, PrivacyService, FriendListService, SearchService, GroupsService, GroupPostsService, PostCommentsService],
})
export class AppModule { }
