import { GroupPosts } from "src/group-posts/groupPosts.entity";

export default interface ICreateComment {
    content: string;
    postData: GroupPosts;
}