import Logger from '../../../../pkg/logger'
import { Params, Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { RequestParams } from '../../../../helpers/requestParams'
import { Order } from 'sequelize'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Store(body: Store) {
        return this.schema.product.create(body)
    }

    public async GetByCode(code: string, store_id: string, id?: string) {
        const where = {
            code,
            store_id,
        }

        if (id) Object.assign(where, { id: { [this.schema.Op.not]: id } })
        return this.schema.product.findOne({
            where,
        })
    }

    public async GetByID(id: string) {
        return this.schema.product.findByPk(id)
    }

    public async Fetch(request: RequestParams<Params>, store_id: string) {
        const where = { store_id }
        const order: Order = []

        if (request.keyword) {
            Object.assign(where, {
                [this.schema.Op.or]: {
                    name: {
                        [this.schema.Op.iLike]: `%${request.keyword}%`,
                    },
                    code: {
                        [this.schema.Op.iLike]: `%${request.keyword}%`,
                    },
                },
            })
        }

        if (request.category) {
            Object.assign(where, {
                category: request.category,
            })
        }

        if (request.is_available) {
            Object.assign(where, {
                stock: {
                    [this.schema.Op.gt]: 0,
                },
            })
            Object.assign(where, {
                is_active: true,
            })
        }

        if (request.is_promo) {
            Object.assign(where, {
                discount: {
                    [this.schema.Op.gt]: 0,
                },
            })
        }

        if (['name', 'stock', 'discount'].includes(request.sort_by)) {
            order.push([request.sort_by, request.sort_order])
        }

        const { count, rows } = await this.schema.product.findAndCountAll({
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
        return this.schema.product.update(
            { ...body, updated_at: new Date() },
            {
                where: {
                    id,
                },
            }
        )
    }

    public async Delete(id: string) {
        return this.schema.product.destroy({
            where: {
                id,
            },
        })
    }

    public async GetCategories(store_id: string) {
        return this.schema.product.findAll({
            group: ['category'],
            where: {
                store_id,
            },
            attributes: ['category'],
        })
    }
}

export default Repository
