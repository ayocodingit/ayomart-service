import Logger from '../../../../pkg/logger'
import {
    Fetch,
    Product,
    ProductOrder,
    ReceivedOrder,
    Store,
    StoreProduct,
} from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { RequestParams } from '../../../../helpers/requestParams'
import { Order, Transaction } from 'sequelize'
import { order_type, status } from '../../../../database/constant/order'
import { endOfDay, format, startOfDay } from 'date-fns'
import { isValidDate } from '../../../../helpers/date'
import error from '../../../../pkg/error'
import statusCode from '../../../../pkg/statusCode'
import generateCode from '../../../../helpers/generator'
import voucher from '../../../../helpers/voucher'

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
                code: generateCode('order'),
                change:
                    body.order_type == order_type.CASHIER
                        ? body.paid - productProduct.total
                        : 0,
            },
            {
                transaction: t,
            }
        )
    }

    public async UpdateCustomerDebt(id: string, debt: number, t: Transaction) {
        return this.schema.customer.increment('debt', {
            by: -debt,
            where: {
                id,
            },
            transaction: t,
        })
    }

    public async UpdateStoreBalance(id: string, total: number, t: Transaction) {
        return this.schema.store.increment('balance', {
            by: total,
            where: {
                id,
            },
            transaction: t,
        })
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

    public async GetCustomer(id: string) {
        return this.schema.customer.findByPk(id)
    }

    public async GetByID(id: string) {
        return this.schema.order.findByPk(id, {
            include: [this.schema.productOrder, this.schema.store],
        })
    }

    public async GetByCode(code: string) {
        return this.schema.order.findOne({
            where: {
                code,
            },
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

        const rows = await this.schema.order.findAll({
            limit: request.per_page,
            offset: request.offset,
            where,
            order,
        })

        const count = await this.schema.order.count({
            where,
        })

        return {
            data: rows,
            count,
        }
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
            stock: number
        }[] = await this.schema.product.findAll({
            where: {
                id: {
                    [this.schema.Op.in]: items.map((item) => item.id),
                },
                stock: {
                    [this.schema.Op.gt]: 0,
                },
                is_active: true,
                store_id,
            },
            attributes: ['id', 'name', 'price', 'discount', 'unit', 'stock'],
        })

        if (result.length != items.length) {
            throw new error(
                statusCode.BAD_REQUEST,
                'transaksi gagal karena terdapat produk yang tidak tersedia'
            )
        }

        const products: Product[] = []
        let total = 0
        let discount = 0
        for (const product of result) {
            const item = items.find((item) => item.id === product.id)
            if (!item) {
                throw new error(
                    statusCode.BAD_REQUEST,
                    'transaksi gagal karena terdapat produk yang tidak tersedia'
                )
            }

            const discounts =
                voucher.calculateDiscount(product.price, product.discount) *
                item.qty

            products.push({
                product_id: product.id,
                name: product.name,
                unit: product.unit,
                price: product.price,
                discount: product.discount,
                voucher: discounts,
                note: item.note,
                qty: item.qty,
            })

            const amount = item.qty * product.price

            discount += discounts
            total += amount - discounts

            if (item.qty > product.stock) {
                throw new error(
                    statusCode.BAD_REQUEST,
                    'transaksi gagal karena terdapat produk yang tidak tersedia'
                )
            }
        }

        tax = total * (tax / 100)

        if (isTaxBorneCustomer) total = total + tax

        return { products, total, discount, tax, isTaxBorneCustomer }
    }

    public async ReceivedOrder(body: ReceivedOrder, id: string) {
        return this.schema.order.update(
            { ...body, update_at: new Date() },
            {
                where: {
                    id,
                    store_id: body.store_id,
                },
            }
        )
    }

    public async SyncProducts(products: any[], t: Transaction) {
        for (const product of products) {
            await this.schema.product.increment('stock', {
                by: -product.qty,
                where: {
                    id: product.product_id,
                },
                transaction: t,
            })
        }
    }
}

export default Repository
