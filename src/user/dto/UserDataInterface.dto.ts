export default interface UserDataInterface {
    id: string;
    email: string;
    pwdHash: string;
    username: string;
    currentTokenId: string | null;
    isDeactivated: boolean;
    deactivationDate: Date | null;
}