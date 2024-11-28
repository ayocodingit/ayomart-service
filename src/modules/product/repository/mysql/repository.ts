import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Store(body: Store) {
        return this.schema.product.create(body)
    }

    public async GetByName(name: string, userID: string) {
        return this.schema.product.findOne({
            where: {
                name,
                created_by: userID,
            },
        })
    }
}

export default Repository
