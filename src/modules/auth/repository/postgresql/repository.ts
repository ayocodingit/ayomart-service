import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'
import { Transaction } from 'sequelize'
import { ACTION } from '../../../../database/constant/verification'
import { addDaysToDate } from '../../../../helpers/date'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async CreateUser(body: Store, t: Transaction) {
        return this.schema.user.create(
            {
                username: body.username,
                email: body.email,
                password: body.password,
            },
            {
                transaction: t,
            }
        )
    }

    public async CreateStore(body: Store, t: Transaction) {
        return this.schema.store.create(
            {
                name: body.store_name,
                created_by: body.created_by,
            },
            {
                transaction: t,
            }
        )
    }

    public async CreateVerification(email: string, t: Transaction) {
        return this.schema.verification.create(
            {
                email,
                action: ACTION.SIGNUP,
                text: 'Verification Account',
                expired_at: addDaysToDate(new Date(), 1),
            },
            { transaction: t }
        )
    }

    public async GetTransaction() {
        return this.schema.connection.transaction()
    }

    public async GetByEmail(email: string) {
        return this.schema.user.findOne({
            where: {
                email,
            },
            include: { model: this.schema.store, attributes: ['id', 'name'] },
        })
    }
    public async GetByVerication(id: string) {
        return this.schema.verification.findOne({
            where: {
                id,
                expired_at: {
                    [this.schema.Op.gte]: new Date(),
                },
            },
        })
    }

    public async DeleteVerification(id: string) {
        return this.schema.verification.destroy({
            where: { id },
        })
    }

    public async UpdateStatus(email: string, status: string) {
        return this.schema.user.update(
            {
                status,
            },
            {
                where: {
                    email,
                },
            }
        )
    }
}

export default Repository
