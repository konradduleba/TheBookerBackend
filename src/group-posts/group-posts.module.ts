import { Module } from '@nestjs/common';
import { GroupPostsController } from './group-posts.controller';
import { GroupPostsService } from './group-posts.service';

@Module({
    controllers: [GroupPostsController],
    providers: [GroupPostsService],
    exports: [GroupPostsService]
})
export class GroupPostsModule { }
