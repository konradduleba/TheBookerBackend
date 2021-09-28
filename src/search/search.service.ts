import { Injectable } from '@nestjs/common';
import { UserData } from 'src/user/userData.entity';
import { EQueryType } from './Enums/EQueryType';
import IModifiedData from './Types/IModifiedData';
import ISearchContent from './Types/ISearchContent';

@Injectable()
export class SearchService {
    modifyDataToDisplay = (array: UserData[]): IModifiedData[] => array.map(({ userInformation, username }) => {
        const { id, name, lastname, picture } = userInformation;

        return {
            id, name, lastname, picture, username
        }
    })

    getUserList = async (): Promise<UserData[]> => await UserData.find({
        relations: ['userInformation'],
    });

    checkIfCurrentUserIsContained = (modyfiedData: IModifiedData[], currentUser: UserData) => modyfiedData.map(user => {
        return {
            ...user,
            isThatMe: user.username === currentUser.username
        }
    })

    checkSearchRequirements = async (currentUser: UserData, { query, type }: ISearchContent): Promise<IModifiedData[]> => {
        const userListArray = await this.getUserList();

        if (type === EQueryType.USER) {
            const filteredArray = userListArray.filter(({ userInformation }) => userInformation.name.toLowerCase().includes(query.toLowerCase()) || userInformation.lastname.toLowerCase().includes(query.toLowerCase()));

            const modyfiedData = this.modifyDataToDisplay(filteredArray);

            const isCurrentUserIsContained = this.checkIfCurrentUserIsContained(modyfiedData, currentUser);

            return isCurrentUserIsContained;
        }

        return []
    }

    generateRandomIndexes = (arrayLength: number, limit: number): number[] => {
        const indexes: number[] = [];

        for (let i = 0; i < limit; i++) {
            const number = Math.floor((Math.random() * arrayLength));

            if (!indexes.includes(number)) {
                indexes.push(number)
            }
        }

        return indexes;
    }

    decideWhichUsersDisplay = (userList: UserData[], limit: number) => {
        const indexes: number[] = this.generateRandomIndexes(userList.length, limit);

        const usersToDisplay = indexes.map(index => {
            return userList[index]
        })

        return usersToDisplay;
    }

    getRandomPeople = async (currentUser: UserData): Promise<IModifiedData[]> => {
        const userListArray = await this.getUserList();

        const randomUserList = this.decideWhichUsersDisplay(userListArray, 10);

        const modyfiedData = this.modifyDataToDisplay(randomUserList);

        const isCurrentUserIsContained = this.checkIfCurrentUserIsContained(modyfiedData, currentUser);

        return isCurrentUserIsContained;
    }
}