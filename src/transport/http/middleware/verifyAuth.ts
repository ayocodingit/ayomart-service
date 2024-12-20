import { NextFunction, Response } from 'express'
import Error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import Jwt from '../../../pkg/jwt'
import { role } from '../../../database/constant/user'

export const VerifyAuth = (jwt: Jwt) => {
    return (req: any, res: Response, next: NextFunction) => {
        const { authorization } = req.headers

        if (!authorization) {
            return next(
                new Error(
                    statusCode.UNAUTHORIZED,
                    statusCode[statusCode.UNAUTHORIZED]
                )
            )
        }

        const [_, token] = authorization.split('Bearer ')

        const user = jwt.Verify(token) as User
        let store_id = req.query.store_id

        if (!user || user?.stores.includes(store_id)) {
            return next(
                new Error(
                    statusCode.UNAUTHORIZED,
                    statusCode[statusCode.UNAUTHORIZED]
                )
            )
        }

        req['user'] = user

        req['store_id'] = user.store.id
        return next()
    }
}

export type User = {
    id: string
    email: string
    username: string
    role: string
    stores: Array<{
        id: string
        name: string
    }>
    store_id: string
    iat: number
    exp: number
}
