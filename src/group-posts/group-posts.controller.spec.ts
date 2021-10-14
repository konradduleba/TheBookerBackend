import { Test, TestingModule } from '@nestjs/testing';
import { GroupPostsController } from './group-posts.controller';

describe('GroupPostsController', () => {
  let controller: GroupPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupPostsController],
    }).compile();

    controller = module.get<GroupPostsController>(GroupPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
