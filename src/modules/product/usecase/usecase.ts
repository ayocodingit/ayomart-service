import { Translate } from '../../../helpers/translate'
import error from '../../../pkg/error'
import Jwt from '../../../pkg/jwt'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { Store } from '../entity/interface'
import Repository from '../repository/mysql/repository'

class Usecase {
    constructor(private logger: Logger, private repository: Repository) {}

    public async Store(body: Store, userID: string) {
        const product = await this.repository.GetByName(body.name, userID)
        if (product)
            throw new error(
                statusCode.UNPROCESSABLE_ENTITY,
                JSON.stringify({
                    name: Translate('exists', {
                        attribute: 'name',
                    }),
                }),
                true
            )

        return this.repository.Store(body)
    }
}

export default Usecase
