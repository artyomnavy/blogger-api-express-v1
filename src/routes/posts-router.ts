import {Request, Response, Router} from "express";
import {
} from "../settings";
import {postsRepository} from "../repositories/posts-repository";
import {ErrorsType, Params, RequestWithBody, RequestWithParams, RequestWithParamsAndBody} from "../types/common";
import {CreateAndUpdatePostModel} from "../types/post/input";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {postValidation} from "../validators/posts-validator";
export const postsRouter = Router({})



postsRouter.get('/', (req: Request, res: Response) => {
    res.send(postsRepository.getAllPosts())
})

postsRouter.post('/', authMiddleware, postValidation(), (req: RequestWithBody<CreateAndUpdatePostModel>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body

    const newPost = postsRepository.createPost(title, shortDescription, content, blogId)

    res.status(201).send(newPost)


})

postsRouter.get('/:id', (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id

    let post = postsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return
    } else {
        res.send(post)
    }
})

postsRouter.put('/:id', authMiddleware, postValidation(), (req: RequestWithParamsAndBody<Params, CreateAndUpdatePostModel>, res: Response) => {
    const id = req.params.id
    let {title, shortDescription, content, blogId} = req.body

    const post = postsRepository.getPostById(id)

    if (!post) {
        res.sendStatus(404)
        return
    }

    let isUpdated = postsRepository.updatePost  (id, title, shortDescription, content, blogId)

    if (isUpdated) {
        res.sendStatus(204)
    }
})

postsRouter.delete('/:id', authMiddleware, (req: RequestWithParams<Params>, res: Response) => {
    const id = req.params.id

    const isDeleted = postsRepository.deletePost(id)

    if (isDeleted) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
    }
})