import {db} from "../db/db";

export const blogsRepository = {
    getAllBlogs() {
        return db.blogs
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: String(+new Date()),
            name,
            description,
            websiteUrl
        }

        db.blogs.push(newBlog)
        return newBlog
    },
    getBlogById(id: string) {
        const blog = db.blogs.find(b => b.id === id)
        if (!blog) {
            return null
        } else {
            return blog
        }
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        const blogIndex = db.blogs.findIndex(b => b.id === id)
        const blog = db.blogs.find(b => b.id === id)

        if (blog) {
            let updatedBlog = {
                ...blog,
                name: !name ? blog.name : name,
                description: !description ? blog.description: description,
                websiteUrl: !websiteUrl ? blog.websiteUrl : websiteUrl
            }
            db.blogs.splice(blogIndex, 1, updatedBlog)
            return true
        } else {
            return false
        }
    },
    deleteBlog(id: string) {
        const blogIndex = db.blogs.findIndex(b => b.id === id)
        const blog = db.blogs.find(b => b.id === id)

        if (blog) {
            db.blogs.splice(blogIndex, 1)
            return true
        } else {
            return false
        }
    }
}