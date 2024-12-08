import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { Transaction } from 'sequelize'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async CreateUser(body: Store, t: Transaction) {
        return this.schema.user.create({
            username: body.username,
            email: body.email,
            password: body.password,
        }, {
            transaction: t,
        })
    }

    public async CreateStore(body: Store, t: Transaction) {
        return this.schema.store.create({
            name: body.store_name,
            created_by: body.created_by
        }, {
            transaction: t,
        })
    }

    public async GetTransaction() {
        return this.schema.connection.transaction()
    }

    public async GetByEmail(email: string) {
        return this.schema.user.findOne({
            where: {
                email,
            },
            include: this.schema.store,
        })
    }
}

export default Repository
