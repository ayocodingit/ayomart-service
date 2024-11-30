import Logger from '../../../../pkg/logger'
import {
    Product,
    ProductOrder,
    Store,
    StoreProduct,
} from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { RequestParams } from '../../../../helpers/requestParams'
import { Order, Transaction } from 'sequelize'
import { status } from '../../../../database/constant/order'
import { format } from 'date-fns'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Store(
        body: Store,
        productProduct: ProductOrder,
        tax: number,
        t: Transaction
    ) {
        return this.schema.order.create(
            {
                ...body,
                code: this.generateOrderNumber(),
                total: productProduct.total,
                discount: productProduct.discount,
                tax,
            },
            {
                transaction: t,
            }
        )
    }

    public async StoreProduct(
        body: ProductOrder,
        order_id: string,
        t: Transaction
    ) {
        const productOrder = body.products.map((product) => {
            return {
                ...product,
                order_id,
            }
        })
        return this.schema.productOrder.bulkCreate(productOrder, {
            transaction: t,
        })
    }

    public async GetTransaction() {
        return this.schema.connection.transaction()
    }

    public async GetStoreByID(id: string) {
        return this.schema.store.findByPk(id)
    }

    public async GetByID(id: string) {
        return this.schema.order.findByPk(id, {
            include: this.schema.productOrder,
        })
    }

    public async Fetch(
        request: RequestParams<{ status: string }>,
        store_id: string
    ) {
        const where = { store_id }
        const order: Order = []

        if (request.keyword) {
            Object.assign(where, {
                code: {
                    [this.schema.Op.iLike]: `%${request.keyword}%`,
                },
            })
        }

        if (Object.values(status).includes(request.status)) {
            Object.assign(where, {
                status,
            })
        }

        if (['created_at'].includes(request.sort_by)) {
            order.push([request.sort_by, request.sort_order])
        }

        const { count, rows } = await this.schema.order.findAndCountAll({
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

    private generateOrderNumber(): string {
        const now = new Date()
        const formattedDate = format(now, 'yyMMdd-HHmm')
        const prefix = 'ORD'

        const randomString = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase()

        const orderNumber = `${prefix}-${formattedDate}-${randomString}`

        return orderNumber
    }

    private calculateDiscount = (price: number, discount: number) => {
        const voucher = (price / 100) * discount
        return voucher
    }

    public async getProductOrder(items: StoreProduct[], store_id: string) {
        const result: {
            id: string
            price: number
            name: string
            discount: number
            unit: string
        }[] = await this.schema.product.findAll({
            where: {
                id: {
                    [this.schema.Op.in]: items.map((item) => item.product_id),
                },
                store_id,
            },
            attributes: ['id', 'name', 'price', 'discount', 'unit'],
        })

        const products: Product[] = []
        let total = 0
        let discount = 0
        for (const product of result) {
            const item = items.filter(
                (item) => item.product_id === product.id
            )[0]

            const voucher =
                this.calculateDiscount(product.price, product.discount) *
                item.qty

            products.push({
                name: product.name,
                unit: product.unit,
                price: product.price,
                discount: product.discount,
                voucher: voucher,
                note: item.note,
                qty: item.qty,
            })

            discount += voucher
            total += item.qty * product.price - voucher
        }

        return { products, total, discount }
    }

    public async UpdateStatus(status: string, id: string, store_id: string) {
        return this.schema.order.update(
            { status, update_at: new Date() },
            {
                where: {
                    id,
                    store_id,
                },
            }
        )
    }
}

export default Repository
