import ISinglePost from "src/group-posts/Types/ISinglePost";

export default interface IGroupInfo {
    name: string;
    description: string;
    picture: string;
    owner: string;
    posts: ISinglePost[]
}