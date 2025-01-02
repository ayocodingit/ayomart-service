import Logger from '../../../../pkg/logger'
import { Store } from '../../entity/interface'
import { Schema } from '../../../../database/sequelize/interface'

class Repository {
    constructor(private logger: Logger, private schema: Schema) {}

    public async GetByID(id: string) {
        return this.schema.store.findByPk(id)
    }

    public async Update(body: Store, id: string) {
        return this.schema.store.update(
            { ...body, updated_at: new Date() },
            {
                where: {
                    id,
                },
            }
        )
    }
}

export default Repository
