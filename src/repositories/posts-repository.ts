import {db} from "../db/db";

export const postsRepository = {
    getAllPosts() {
        return db.posts
    },
    createPost(title: string, shortDescription: string, content :string, blogId: string) {
        const newPost = {
            id: String(+new Date()),
            title,
            shortDescription,
            content,
            blogId,
            blogName: 'blogName'
        }

        db.posts.push(newPost)
        return newPost
    },
    getPostById(id: string) {
        const post = db.posts.find(p => p.id === id)
        if (!post) {
            return null
        } else {
            return post
        }
    },
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const postIndex = db.posts.findIndex(p => p.id === id)
        const post = db.posts.find(p => p.id === id)

        if (post) {
            let updatedPost = {
                ...post,
                title: title ? title : post.title,
                shortDescription: shortDescription ? shortDescription : post.shortDescription,
                content: content ? content : post.content,
                blogId: blogId ? blogId : post.blogId
            }
            db.posts.splice(postIndex, 1, updatedPost)
            return true
        } else {
            return false
        }
    },
    deletePost(id: string) {
        const postIndex = db.posts.findIndex(p => p.id === id)
        const post = db.posts.find(p => p.id === id)

        if (post) {
            db.posts.splice(postIndex, 1)
            return true
        } else {
            return false
        }
    }
}