import {BlogsType} from "../types/blog/output";
import {PostsType} from "../types/post/output";

export type DBType = {
    blogs: BlogsType[],
    posts: PostsType[]
}

export const db: DBType = {
    blogs: [
        {
            id: "1",
            name: "Blog",
            description: "First blog",
            websiteUrl: "https://firstblog.com"
        }
    ],
    posts: [
        {
            id: '1',
            title: 'Post',
            shortDescription: 'First post',
            content: 'Post',
            blogId: '1',
            blogName: 'Blog'
        }
    ]
}