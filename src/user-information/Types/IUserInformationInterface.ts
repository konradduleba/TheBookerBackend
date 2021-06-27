export default interface IUserInformationInterface {
    id: string;
    name: string;
    lastname: string;
    picture: string;
    memberSince: Date;
    lastUpdate: Date;
    school: string | null;
    status: string | null;
    sex: string | null;
    city: string | null;
    birthday: Date | null;
    email: string | null;
    phone: string | null;
    lookingFor: string | null;
    interestedIn: string | null;
    relationshipStatus: string | null;
    partner: string | null;
    interests: string | null;
    favouriteMusic: string | null;
    favouriteMovies: string | null;
    aboutMe: string;
}