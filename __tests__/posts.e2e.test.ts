import request from 'supertest'
import {app} from "../src/settings"
import {PostsType} from "../src/types/post/output";
import {db, DBType} from "../src/db/db";

const login = 'admin'
const password = 'qwerty'

describe('/posts', () => {
    let newPost: PostsType | null = null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('GET posts database', async () => {
        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('- POST does not create post with incorrect login and password)', async () => {
        await request(app)
            .post('/posts')
            .auth('name', 'pass')
            .expect(401)

        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('- POST does not create post with incorrect title, shortDescription, content and blogId)', async () => {
        await request(app)
            .post('/posts')
            .auth(login, password)
            .send({title: '', shortDescription: '', content: '', blogId: '1'})
            .expect(400, {
                errorsMessages: [
                    {message: 'Invalid title', field: 'title'},
                    {message: 'Invalid shortDescription', field: 'shortDescription'},
                    {message: 'Invalid content', field: 'content'},
                    {message: 'Invalid blogId', field: 'blogId'},
                ]
            })

        await request(app)
            .get('/posts')
            .expect(200, [])
    })

    it('+ POST create post with correct data)', async () => {
        db.blogs[0] = {
            id: "1",
            name: "blog",
            description: "First blog",
            websiteUrl: "https://firstblog.com"
        }

        const createPost = await request(app)
            .post('/posts')
            .auth(login, password)
            .send({title: 'New post 1', shortDescription: 'New shortDescription 1', content: 'New content 1', blogId: '1'})
            .expect(201)

        newPost = createPost.body

        expect(newPost).toEqual({
            id: expect.any(String),
            title: 'New post 1',
            shortDescription: 'New shortDescription 1',
            content: 'New content 1',
            blogId: '1',
            blogName: expect.any(String)
        })

        await request(app)
            .get('/posts')
            .expect(200, [newPost])
    })

    it('- GET post by ID with incorrect id', async () => {
        await request(app)
            .get('/posts/' + -1)
            .expect(404)
    })

    it('+ GET post by ID with correct id', async () => {
        await request(app)
            .get('/posts/' + newPost!.id)
            .expect(200, newPost)
    })

    it('- PUT post by ID with incorrect id', async () => {
        await request(app)
            .put('/posts/' + -1)
            .auth(login, password)
            .send({title: 'Bad title', shortDescription: 'Bad shortDescription', content: 'Bad content', blogId: '1' })
            .expect(404)

        await request(app)
            .get('/posts')
            .expect(200, [newPost])
    })

    it('- PUT post by ID with incorrect data', async () => {
        await request(app)
            .put('/posts/' + newPost!.id)
            .auth(login, password)
            .send({title: '', shortDescription: '', content: '', blogId: ''})
            .expect(400)

        await request(app)
            .get('/posts')
            .expect(200, [newPost])
    })

    it('+ PUT post by ID with correct data', async () => {
        await request(app)
            .put('/posts/' + newPost!.id)
            .auth(login, password)
            .send({title: 'New post 2', shortDescription: 'New shortDescription 2', content: 'New content 2', blogId: '1'})
            .expect(204)

        const res = await request(app).get('/posts/')
        expect(res.body[0]).toEqual({
            ...newPost,
            title: 'New post 2',
            shortDescription: 'New shortDescription 2',
            content: 'New content 2',
        })
        newPost = res.body[0]
    })

    it('- DELETE post by ID with incorrect id', async () => {
        await request(app)
            .delete('/posts/' + -1)
            .auth(login, password)
            .expect(404)

        await request(app)
            .get('/posts')
            .expect(200, [newPost])
    })

    it('+ DELETE post by ID with correct id', async () => {
        await request(app)
            .delete('/posts/' + newPost!.id)
            .auth(login, password)
            .expect(204)

        await request(app)
            .get('/posts')
            .expect(200, [])
    })

})