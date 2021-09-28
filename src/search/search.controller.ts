import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from 'src/decorators/userobj.decorator';
import { UserData } from 'src/user/userData.entity';
import { SearchService } from './search.service';
import ISearchContent from './Types/ISearchContent';

@Controller('search')
export class SearchController {
    constructor(
        @Inject(SearchService) private searchService: SearchService
    ) { }

    @Post('/query')
    @UseGuards(AuthGuard('jwt'))
    SearchQuery(
        @UserObj() user: UserData,
        @Body() content: ISearchContent
    ) {
        return this.searchService.checkSearchRequirements(user, content);
    }

    @Get('/random')
    @UseGuards(AuthGuard('jwt'))
    GetRandomPeople(
        @UserObj() user: UserData,
    ) {
        return this.searchService.getRandomPeople(user)
    }

}
