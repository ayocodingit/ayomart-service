import { Translate } from '../../../helpers/translate'
import error from '../../../pkg/error'
import Logger from '../../../pkg/logger'
import Minio from '../../../pkg/minio'
import statusCode from '../../../pkg/statusCode'
import { File, Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'
import { readFileSync } from 'fs'
import Sharp from '../../../pkg/sharp'
import { RequestParams } from '../../../helpers/requestParams'

class Usecase {
    constructor(
        private logger: Logger,
        private repository: Repository,
        private minio: Minio
    ) {}

    private async upload(images: File[], store_id: string) {
        for (const image of images) {
            const { meta, source } = await Sharp.Convert(
                readFileSync(image.path),
                image.filename,
                'jpeg',
                80
            )
            Object.assign(image, meta)
            image.path = `/${store_id}/product/${image.filename}`
            const uri = await this.minio.Upload(
                image.path,
                source,
                image.size,
                image.mimetype
            )
            image.uri = uri
        }

        return images
    }

    public async Store(body: Store) {
        body.images = await this.upload(body.images, body.store_id)

        const product = await this.repository.GetByName(
            body.name,
            body.store_id
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
}

export default Usecase
