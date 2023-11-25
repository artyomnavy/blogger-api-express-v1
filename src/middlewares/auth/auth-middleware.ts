import {Request, Response, NextFunction} from "express";
import {Buffer} from 'node:buffer'

const login = 'admin'
const password = 'qwerty'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //Simple way
    /*if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401)
        return
    }
    return next()
    */

    const auth = req.headers['authorization']

    if (!auth) {
        res.sendStatus(401)
        return
    }

    const [basic, token] = auth.split(' ')

    if (basic !== 'Basic') {
        res.sendStatus(401)
        return
    }

    const decodedData = Buffer.from(token, 'base64').toString()
    //admin:password

    const [decodedLogin, decodedPassword] = decodedData.split(':')

    if (decodedLogin !== login || decodedPassword !== password) {
        res.sendStatus(401)
        return
    }

    return next()
}