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

class Customer {
    public usecase: Usecase

    constructor(
        private logger: Logger,
        private config: Config,
        connection: Connection
    ) {
        const schema = Sequelize.Models(connection)
        const repository = new Repository(logger, schema)
        this.usecase = new Usecase(logger, repository)
    }

    public RunHttp(http: Http) {
        const handler = new Handler(this.logger, http, this.usecase)
        this.httpPrivate(handler, http)
        return this
    }

    private httpPrivate(handler: Handler, http: Http) {
        const Router = http.Router()
        const jwt = new Jwt(this.config.jwt.access_key)
        const auth = VerifyAuth(jwt)

        Router.post('/', handler.Store as RequestHandler)
        Router.get('/', handler.Fetch as RequestHandler)
        Router.get('/:id', handler.Show as RequestHandler)
        Router.delete('/:id', handler.Destroy as RequestHandler)
        Router.put('/:id', handler.Update as RequestHandler)

        http.SetRouter('/v1/customers/', auth, Router)
    }
}

export default Customer
