import { Injectable } from '@nestjs/common';
import AddUserRole from './dto/addUserRole.dts';
import { UserSettings } from './userSettings.entity';

@Injectable()
export class UserSettingsService {

    addUserRole = async ({ role }: AddUserRole) => {

        const doesRoleExist = await UserSettings.findOne({
            where: {
                role
            }
        })

        if (doesRoleExist) {
            return {
                status: 200,
                message: `${role} already exists`
            }
        }

        const newRole = new UserSettings();
        newRole.role = role;

        await newRole.save();

        return newRole;
    }
}
