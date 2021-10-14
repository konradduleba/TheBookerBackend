export default interface IGroupPosts {
    id: string;
    date: Date;
    title: string;
    authorName: string;
    authorLastname: string;
    authorUsername: string;
    content: string;
    authorId: string;
    isActive: boolean;
}