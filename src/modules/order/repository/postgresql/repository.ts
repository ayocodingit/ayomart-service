import Logger from '../../../../pkg/logger'
import {
    Fetch,
    Product,
    ProductOrder,
    Store,
    StoreProduct,
} from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { RequestParams } from '../../../../helpers/requestParams'
import { Order, Transaction } from 'sequelize'
import { order_type, status } from '../../../../database/constant/order'
import { endOfDay, format, startOfDay } from 'date-fns'
import { isValidDate } from '../../../../helpers/date'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async Store(
        body: Store,
        productProduct: ProductOrder,
        t: Transaction
    ) {
        return this.schema.order.create(
            {
                ...body,
                ...productProduct,
                code: this.generateOrderNumber(),
                change_money:
                    body.order_type == order_type.CASHIER
                        ? body.paid - productProduct.total
                        : 0,
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
        return this.schema.store.findByPk(id, {
            attributes: ['id', 'tax', 'isTaxBorneCustomer'],
        })
    }

    public async GetByID(id: string) {
        return this.schema.order.findByPk(id, {
            include: this.schema.productOrder,
        })
    }

    public async Fetch(request: RequestParams<Fetch>, store_id: string) {
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
                status: request.status,
            })
        }

        if (['created_at'].includes(request.sort_by)) {
            order.push([request.sort_by, request.sort_order])
        }

        if (isValidDate(request.start_date) && isValidDate(request.end_date)) {
            Object.assign(where, {
                created_at: {
                    [this.schema.Op.between]: [
                        startOfDay(new Date(request.start_date)),
                        endOfDay(new Date(request.end_date)),
                    ],
                },
            })
        }

        if (order.length === 0) {
            order.push(['created_at', 'desc'])
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

    public async getProductOrder(
        items: StoreProduct[],
        store_id: string,
        tax: number,
        isTaxBorneCustomer: boolean
    ) {
        const result: {
            id: string
            price: number
            name: string
            discount: number
            unit: string
        }[] = await this.schema.product.findAll({
            where: {
                id: {
                    [this.schema.Op.in]: items.map((item) => item.id),
                },
                store_id,
            },
            attributes: ['id', 'name', 'price', 'discount', 'unit'],
        })

        const products: Product[] = []
        let total = 0
        let discount = 0
        for (const product of result) {
            const item = items.filter((item) => item.id === product.id)[0]

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

            const amount = item.qty * product.price

            discount += voucher
            total += amount - voucher
        }

        tax = total * (tax / 100)

        if (isTaxBorneCustomer) {
            total = total + tax
        }

        return { products, total, discount, tax, isTaxBorneCustomer }
    }

    public async UpdateStatus(
        status: string,
        id: string,
        store_id: string,
        user_id: string
    ) {
        return this.schema.order.update(
            { status, update_at: new Date(), received_by: user_id },
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
