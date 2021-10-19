import { Inject, Injectable } from '@nestjs/common';
import { FriendInvites } from 'src/friend-list/friend-invites.entity';
import { FriendList } from 'src/friend-list/friend-list.entity';
import { PrivacyService } from 'src/privacy/privacy.service';
import { UserInformation } from 'src/user-information/user-information.entity';
import { UserInformationService } from 'src/user-information/user-information.service';
import UserRole from 'src/user-settings/enums/UserRole.enum';
import { UserSettings } from 'src/user-settings/userSettings.entity';
import EPicturePath from 'src/utils/EPicturePath';
import { hashPwd } from 'src/utils/hash-pwd';
import InputUserRole from './dto/InputUserRole.dto';
import UserRegistration from './dto/UserRegistration.dto';
import { EMessageFailed } from './Enums/EMessage.enum';
import ICheckTokenAndReturnUserDataInterface from './Types/ICheckTokenAndReturnUserDataInterface';
import IDeactivateData from './Types/IDeactivateData';
import IPassword from './Types/IPassword';
import IReturnedInfoFromBackend from './Types/IReturnedInfoFromBackend';
import IUserDataInterface from './Types/IUserDataInterface';
import IUsername from './Types/IUsername';
import IValidatedUserDataInterface from './Types/IValidatedUserDataInterface';
import { UserData } from './userData.entity';

@Injectable()
export class UserService {
    constructor(
        @Inject(PrivacyService) private privacyService: PrivacyService,
        @Inject(UserInformationService) private userInformationService: UserInformationService,
    ) { }

    checkIfEmailIsAvaible = async (email: string): Promise<IReturnedInfoFromBackend> => {
        const isMailAlreadyTaken = await UserData.findOne({ email });

        if (isMailAlreadyTaken)
            return {
                isSuccess: false,
                message: EMessageFailed.EMAIL_IS_TAKEN
            }

        return { isSuccess: true }
    }

    calculateDeactivationDate = (numberOfDays: number): Date => {
        const future = new Date();

        const newDate = future.setDate(future.getDate() + numberOfDays);

        return new Date(newDate);
    }

    checkIfRoleIsAvaible = async (role: UserRole): Promise<UserSettings> => await UserSettings.findOneOrFail({ role });

    checkIfUsernameIsAvaible = async (username: string) => await UserData.findOne({ username });

    createUsernameForNewUser = async (name: string, lastname: string): Promise<string> => {
        const newName = name.toLowerCase();
        const newLastname = lastname.toLowerCase();

        const username = `${newName}${newLastname}`;

        const numberOfUsersWithThisCredentials = await this.userInformationService.checkHowMuchUsersHaveTheSameCredentials(name, lastname);

        if (numberOfUsersWithThisCredentials)
            return `${username}${numberOfUsersWithThisCredentials}`;

        return username;
    }

    appendDefaultDataToTheNewUser = async ({ email, pwd, lastname, name }: UserRegistration): Promise<UserData> => {
        const newUser = new UserData();

        const newUsername = await this.createUsernameForNewUser(name, lastname);

        newUser.email = email;
        newUser.username = newUsername
        newUser.pwdHash = hashPwd(pwd);
        newUser.userSettings = await this.checkIfRoleIsAvaible(UserRole.USER);
        newUser.userPrivacy = await this.privacyService.setDefaultPrivacySettings();
        newUser.userInformation = await this.userInformationService.setDefaultInformation(name, lastname);

        newUser.save();

        const newUserInAvaibleFriendList = new FriendList();

        newUserInAvaibleFriendList.name = name;
        newUserInAvaibleFriendList.lastname = lastname;
        newUserInAvaibleFriendList.picture = "default-picture.png";
        newUserInAvaibleFriendList.username = newUsername;

        newUserInAvaibleFriendList.save();

        const newUserInFriendInvites = new FriendInvites();

        newUserInFriendInvites.name = name;
        newUserInFriendInvites.lastname = lastname;
        newUserInFriendInvites.picture = "default-picture.png";
        newUserInFriendInvites.username = newUsername;

        newUserInFriendInvites.save();

        return newUser;
    }

    createUser = async (newUserData: UserRegistration): Promise<IReturnedInfoFromBackend> => {
        const { email } = newUserData;
        const canRegister = await this.checkIfEmailIsAvaible(email);

        if (!canRegister.isSuccess)
            return canRegister;

        const newUser = await this.appendDefaultDataToTheNewUser(newUserData);

        if (newUser)
            return {
                isSuccess: true
            }

        return {
            isSuccess: false,
            message: EMessageFailed.USER_NOT_REGISTERED
        }
    }

    checkTokenAndReturnUserData = async (currentTokenId: string): Promise<ICheckTokenAndReturnUserDataInterface> => {
        const userData = await UserData.findOne({
            relations: ['userSettings', 'userPrivacy', 'userInformation'],
            where: {
                currentTokenId
            }
        });

        if (userData)
            return {
                isSuccess: true,
                userData
            }

        return {
            isSuccess: false
        }
    }

    setDefaultAccountInfo = ({ username, userSettings }: IUserDataInterface) => {
        const { role } = userSettings;

        return { username, userRole: role }
    }

    validateDisplayingUserData = (userData: IUserDataInterface): IValidatedUserDataInterface => {
        const { userRole } = this.setDefaultAccountInfo(userData);

        return { userRole };
    }

    getUserData = async ({ currentTokenId }: UserData): Promise<IReturnedInfoFromBackend> => {
        const { isSuccess, userData } = await this.checkTokenAndReturnUserData(currentTokenId);

        if (!isSuccess)
            return {
                isSuccess,
                message: EMessageFailed.EMPTY_USER_DATA
            }

        const validatedData = this.validateDisplayingUserData(userData)

        return {
            isSuccess,
            userData: validatedData
        };
    }

    changeUserRole = async ({ currentTokenId, id }: UserData, { role }: InputUserRole) => {
        const { isSuccess, userData } = await this.checkTokenAndReturnUserData(currentTokenId);

        if (!isSuccess)
            return {
                isSuccess,
                message: EMessageFailed.EMPTY_USER_DATA
            }

        const { role: userRole } = userData.userSettings;

        if (role === userRole)
            return {
                isSuccess: false,
                message: EMessageFailed.USER_HAVE_THIS_ROLE
            }

        const checkIfRoleExist = await this.checkIfRoleIsAvaible(role);

        const { affected } = await UserData.update(id, { userSettings: checkIfRoleExist });

        return {
            isSuccess: true,
            affected
        };
    }

    changeUsername = async ({ currentTokenId, id }: UserData, { newUsername }: IUsername) => {
        const { isSuccess, userData } = await this.checkTokenAndReturnUserData(currentTokenId);

        if (!isSuccess)
            return {
                isSuccess,
                message: EMessageFailed.EMPTY_USER_DATA
            }

        const { username } = userData;

        if (username === newUsername)
            return {
                isSuccess: false,
                message: EMessageFailed.USER_HAVE_THIS_USERNAME
            }

        const checkIfUsernameIsAvaible = await this.checkIfUsernameIsAvaible(newUsername);

        if (!checkIfUsernameIsAvaible) {
            const { affected } = await UserData.update(id, { username: newUsername });

            return {
                isSuccess: true,
                affected
            };
        }

        return {
            isSuccess: false,
            message: EMessageFailed.USERNAME_IS_NOT_AVAIBLE
        }
    }

    checkIfUserTypesCurrentPassword = (currentPassword: string, passwordToCheck: string): boolean => {
        const checkPassword = hashPwd(passwordToCheck);

        if (currentPassword !== checkPassword)
            return false;

        return true;
    }

    changePassword = async ({ id, pwdHash }: UserData, { newPassword, currentPassword }: IPassword) => {
        const isCurrentPasswordCorrect = this.checkIfUserTypesCurrentPassword(pwdHash, currentPassword);

        if (!isCurrentPasswordCorrect)
            return { isSuccess: false };

        const password = hashPwd(newPassword);

        const { affected } = await UserData.update(id, { pwdHash: password });

        return {
            isSuccess: true,
            affected
        };
    }

    deactivateUser = async ({ id, pwdHash }: UserData, { numberOfDays, currentPassword }: IDeactivateData) => {
        const isCurrentPasswordCorrect = this.checkIfUserTypesCurrentPassword(pwdHash, currentPassword);

        if (!isCurrentPasswordCorrect)
            return { isSuccess: false };

        const deactivationDate = this.calculateDeactivationDate(numberOfDays);

        const { affected } = await UserData.update(id, {
            deactivationDate,
            isDeactivated: true
        });

        return {
            isSuccess: true,
            affected
        };
    }

    updateProfilePicture = async ({ currentTokenId }: UserData, filename: string) => {
        const { userInformation } = await UserData.findOne({
            where: {
                currentTokenId
            },
            relations: ['userInformation']
        })

        const result = await UserInformation.update(userInformation.id, {
            picture: filename
        })

        if (result) {
            const { raw } = result;

            return {
                isSuccess: !!raw.affectedRows
            }
        }
    }

    getSmallUserData = async ({ currentTokenId }: UserData) => {
        const { userInformation } = await UserData.findOne({
            where: {
                currentTokenId
            },
            relations: ['userInformation']
        })

        const { name, picture } = userInformation;

        return {
            name,
            picture: `${EPicturePath.PICTURE_PATH}${picture}`,
            notificationNumber: 0
        }
    }
}
