import {Request, Response, Router} from "express"
import {db} from "../db/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req: Request, res: Response) => {
    db.blogs.length = 0
    db.posts.length = 0
    res.sendStatus(204)
})