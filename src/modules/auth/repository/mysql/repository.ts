import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { Transaction } from 'sequelize'
import { status } from '../../../../database/constant/user'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async CreateUser(body: Store, t: Transaction) {
        return this.schema.user.create(body, {
            transaction: t,
        })
    }

    public async CreateStore(body: Store, t: Transaction) {
        return this.schema.store.create(body, {
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
        })
    }
}

export default Repository
