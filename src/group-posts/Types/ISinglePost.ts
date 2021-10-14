export default interface ISinglePost {
    date: Date;
    title: string;
    author: {
        name: string;
        lastname: string;
        username: string;
    }
    content: string;
}