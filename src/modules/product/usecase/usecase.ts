import { extname } from 'path'
import { Translate } from '../../../helpers/translate'
import error from '../../../pkg/error'
import Jwt from '../../../pkg/jwt'
import Logger from '../../../pkg/logger'
import Minio from '../../../pkg/minio'
import statusCode from '../../../pkg/statusCode'
import { File, Store } from '../entity/interface'
import Repository from '../repository/mysql/repository'
import { readFileSync } from 'fs'

class Usecase {
    constructor(
        private logger: Logger,
        private repository: Repository,
        private minio: Minio
    ) {}

    private async Upload(images: File[]) {
        for (const image of images) {
            const ext = extname(image.originalname)
            const source = readFileSync(image.path)
            const uri = await this.minio.Upload(
                image.filename + ext,
                source,
                image.size,
                image.mimetype
            )
            image.uri = uri
        }

        return images
    }

    public async Store(body: Store) {
        body.images = await this.Upload(body.images)

        const product = await this.repository.GetByName(
            body.name,
            body.created_by
        )
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
