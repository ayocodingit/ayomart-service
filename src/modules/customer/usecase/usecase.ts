import { Translate } from '../../../helpers/translate'
import error from '../../../pkg/error'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'
import { RequestParams } from '../../../helpers/requestParams'

class Usecase {
    constructor(private logger: Logger, private repository: Repository) {}

    private async validateName(name: string, store_id: string, id?: string) {
        const customer = await this.repository.GetByName(name, store_id, id)

        if (customer)
            throw new error(
                statusCode.BAD_REQUEST,
                Translate('exists', {
                    attribute: 'Konsumen',
                })
            )
    }

    public async Store(body: Store) {
        await this.validateName(body.name, body.store_id)

        return this.repository.Store(body)
    }

    public async Fetch(request: RequestParams<{}>, store_id: string) {
        const result = await this.repository.Fetch(request, store_id)
        return result
    }

    public async Show(id: string) {
        const result = await this.repository.GetByID(id)

        if (!result) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        return result
    }

    public async Update(body: Store, id: string) {
        const result = await this.repository.GetByID(id)

        if (!result) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        await this.validateName(body.name, result.store_id, id)

        return this.repository.Update(body, id)
    }

    public async Destroy(id: string) {
        const result = await this.repository.GetByID(id)

        if (!result) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        return this.repository.Delete(id)
    }
}

export default Usecase
