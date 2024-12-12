import { NextFunction, Response } from 'express'
import Error from '../../../pkg/error'
import statusCode from '../../../pkg/statusCode'
import Jwt from '../../../pkg/jwt'

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

        const decode = jwt.Verify(token) as User
        if (!decode) {
            return next(
                new Error(
                    statusCode.UNAUTHORIZED,
                    statusCode[statusCode.UNAUTHORIZED]
                )
            )
        }
        req['user'] = decode
        let store_id = req.query.store_id
        if (!decode.stores.includes(store_id)) store_id = decode.stores[0]?.id

        req['store_id'] = store_id
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
    iat: number
    exp: number
}
