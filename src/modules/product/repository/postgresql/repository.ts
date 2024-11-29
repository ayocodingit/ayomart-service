import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { RequestParams } from '../../../../helpers/requestParams'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Store(body: Store) {
        return this.schema.product.create(body)
    }

    public async GetByName(name: string, store_id: string) {
        return this.schema.product.findOne({
            where: {
                name,
                store_id,
            },
        })
    }

    public async GetByID(id: string) {
        return this.schema.product.findByPk(id)
    }

    public async Fetch(request: RequestParams<{}>, store_id: string) {
        const where = { store_id }

        const { count, rows } = await this.schema.product.findAndCountAll({
            limit: request.per_page,
            offset: request.offset,
            where,
        })

        return {
            data: rows,
            count,
        }
    }
}

export default Repository
