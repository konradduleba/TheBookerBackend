import { Injectable } from '@nestjs/common';
import UserDataInterface from 'src/user/dto/UserDataInterface.dto';
import { UserData } from 'src/user/userData.entity';
import { Privacy } from './privacy.entity';
import IChangePrivacySettingsInterface from './Types/IChangePrivacySettingsInterface';
import IPrivacyInterface from './Types/IPrivacyInteface';
import IReturnPrivacyInfoInterface from './Types/IReturnPrivacyInfoInterface';
import IValidatedPrivacyDataInterface from './Types/IValidatedPrivacyDataInterface';

@Injectable()
export class PrivacyService {
    getUserPrivacyInfo = async (currentTokenId: string): Promise<IPrivacyInterface> => {
        const { userPrivacy } = await UserData.findOne({
            relations: ['userPrivacy'],
            where: {
                currentTokenId
            }
        })

        return userPrivacy;
    }

    setDefaultPrivacySettings = async (): Promise<Privacy> => {
        const defaultPrivacySettings = new Privacy();

        await defaultPrivacySettings.save();

        return defaultPrivacySettings;
    }

    changeUserPrivacySettings = async ({ user, options }: IChangePrivacySettingsInterface): Promise<IReturnPrivacyInfoInterface> => {
        const { currentTokenId } = user;

        const { id } = await this.getUserPrivacyInfo(currentTokenId);

        const { affected } = await Privacy.update(id, options);

        if (affected)
            return {
                isSuccess: true,
                affected
            }

        return {
            isSuccess: false,
            affected
        };
    }

    validateUserPrivacyData = (userPrivacy: IPrivacyInterface): IValidatedPrivacyDataInterface => {
        const { id, ...privacyInfo } = userPrivacy;
        return privacyInfo;
    }

    getUserPrivacySettings = async ({ currentTokenId }: UserDataInterface): Promise<IReturnPrivacyInfoInterface> => {
        const { id } = await this.getUserPrivacyInfo(currentTokenId);

        const userPrivacyData = await Privacy.findOne({ id });

        const privacyInfo = this.validateUserPrivacyData(userPrivacyData);

        return {
            isSuccess: true,
            privacyInfo
        }
    }
}
