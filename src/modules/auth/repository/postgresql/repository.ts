import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { Transaction } from 'sequelize'
import { ACTION } from '../../../../database/constant/notification'
import { addMinutesToDate } from '../../../../helpers/date'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async CreateUser(body: Store, t: Transaction) {
        return this.schema.user.create(body, {
            transaction: t,
        })
    }

    public async CreateStore(body: Store, t: Transaction) {
        return this.schema.store.create(
            {
                name: body.store_name,
                code: body.code,
            },
            {
                transaction: t,
            }
        )
    }

    public async CreateNotification(
        created_by: string,
        store_id: string,
        code: string,
        t: Transaction
    ) {
        return this.schema.notification.create(
            {
                created_by,
                store_id,
                code,
                expired_at: addMinutesToDate(new Date(), 30),
            },
            { transaction: t }
        )
    }

    public async GetTransaction() {
        return this.schema.connection.transaction()
    }

    public async GetByPhoneNumber(phone_number: string) {
        return this.schema.user.findOne({
            where: {
                phone_number,
            },
            include: {
                model: this.schema.store,
                attributes: ['id', 'name', 'tax', 'isTaxBorneCustomer', 'address', 'logo'],
            },
        })
    }

    public async GetNotification(code: string) {
        return this.schema.notification.findOne({
            where: {
                code,
                expired_at: {
                    [this.schema.Op.gte]: new Date(),
                },
                is_read: false,
            },
        })
    }

    public async UpdateIsReadNotification(code: string, is_read: boolean) {
        return this.schema.notification.update(
            { is_read, updated_at: new Date() },
            {
                where: { code },
            }
        )
    }

    public async UpdateStatus(id: string, status: string) {
        return this.schema.user.update(
            {
                status,
            },
            {
                where: {
                    id,
                },
            }
        )
    }
}

export default Repository
