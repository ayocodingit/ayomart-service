import error from '../../../pkg/error'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'

class Usecase {
    constructor(private logger: Logger, private repository: Repository) {}

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

        return this.repository.Update(body, id)
    }
}

export default Usecase
