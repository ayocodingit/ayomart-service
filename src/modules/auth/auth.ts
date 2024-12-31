import Http from '../../transport/http/http'
import Logger from '../../pkg/logger'
import Usecase from './usecase/usecase'
import Handler from './delivery/http/handler'
import { Config } from '../../config/config.interface'
import { Connection } from '../../database/sequelize/interface'
import Repository from './repository/postgresql/repository'
import Sequelize from '../../database/sequelize/sequelize'
import { RequestHandler } from 'express'
import Jwt from '../../pkg/jwt'
import { VerifyAuth } from '../../transport/http/middleware/verifyAuth'
import Telegram from '../../external/telegram'

class Auth {
    public usecase: Usecase

    constructor(
        private logger: Logger,
        private config: Config,
        connection: Connection
    ) {
        const schema = Sequelize.Models(connection)
        const repository = new Repository(logger, schema)
        const jwt = new Jwt(config.jwt.access_key)
        const telegram = new Telegram(this.config)
        this.usecase = new Usecase(logger, repository, jwt, telegram)
    }

    public RunHttp(http: Http) {
        const handler = new Handler(this.logger, http, this.usecase)
        this.httpPublic(handler, http)
        return this
    }

    private httpPublic(handler: Handler, http: Http) {
        const Router = http.Router()
        const jwt = new Jwt(this.config.jwt.access_key)
        const auth = VerifyAuth(jwt)

        Router.post('/signup', handler.Store as RequestHandler)
        Router.post('/login', handler.Login as RequestHandler)
        Router.post(
            '/forgot-password',
            handler.ForgotPassword as RequestHandler
        )
        Router.patch(
            '/create-new-password/:code',
            handler.CreateNewPassword as RequestHandler
        )
        Router.post('/verify/:id', handler.Verify as RequestHandler)
        Router.get('/me', auth, handler.Me as RequestHandler)

        http.SetRouter('/v1/auth/', Router)
    }
}

export default Auth
