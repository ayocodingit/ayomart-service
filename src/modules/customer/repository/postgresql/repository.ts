import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { RequestParams } from '../../../../helpers/requestParams'
import { Order } from 'sequelize'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Store(body: Store) {
        return this.schema.customer.create(body)
    }

    public async GetByName(name: string, store_id: string, id?: string) {
        const where = {
            name,
            store_id,
        }

        if (id) Object.assign(where, { id: { [this.schema.Op.not]: id } })
        return this.schema.customer.findOne({
            where,
        })
    }

    public async GetByID(id: string) {
        return this.schema.customer.findByPk(id)
    }

    public async Fetch(request: RequestParams<{}>, store_id: string) {
        const where = { store_id }
        const order: Order = []

        if (request.keyword) {
            Object.assign(where, {
                name: {
                    [this.schema.Op.iLike]: `%${request.keyword}%`,
                },
            })
        }

        const { count, rows } = await this.schema.customer.findAndCountAll({
            limit: request.per_page,
            offset: request.offset,
            where,
            order,
        })

        return {
            data: rows,
            count,
        }
    }

    public async Update(body: Store, id: string) {
        return this.schema.customer.update(
            { ...body, updated_at: new Date() },
            {
                where: {
                    id,
                },
            }
        )
    }

    public async Delete(id: string) {
        return this.schema.customer.destroy({
            where: {
                id,
            },
        })
    }
}

export default Repository
