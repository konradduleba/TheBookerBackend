export default interface IPostComments {
    id: string;
    date: Date;
    authorName: string;
    authorLastname: string;
    authorUsername: string;
    content: string;
    authorId: string;
    isActive: boolean;
}