import error from '../../../pkg/error'
import Logger from '../../../pkg/logger'
import Minio from '../../../pkg/minio'
import statusCode from '../../../pkg/statusCode'
import { File, Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'
import { readFileSync } from 'fs'
import Sharp from '../../../pkg/sharp'
import { RequestParams } from '../../../helpers/requestParams'
import { Translate } from '../../../helpers/translate'

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
                'webp',
                80
            )
            Object.assign(image, meta)
            image.path = `${store_id}/product/${image.filename}`
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
        const t = await this.repository.GetTransaction()
        try {
            const store = await this.repository.GetStoreByID(body.store_id)
            if (!store) {
                throw new error(
                    statusCode.UNPROCESSABLE_ENTITY,
                    JSON.stringify({
                        store_id: Translate('exists', {
                            attribute: 'store_id',
                        }),
                    }),
                    true
                )
            }

            const productOrder = await this.repository.getProductOrder(
                body.products,
                body.store_id
            )

            body.proof_of_payment = await this.upload(
                body.proof_of_payment,
                body.store_id
            )

            const order = await this.repository.Store(
                body,
                productOrder,
                store.tax,
                t
            )

            await this.repository.StoreProduct(productOrder, order.id, t)
            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    public async Fetch(
        request: RequestParams<{ status: string }>,
        store_id: string
    ) {
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

    public async UpdateStatus(status: string, id: string, store_id: string) {
        const result = await this.repository.GetByID(id)

        if (!result) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        if (!Object.values(status).includes(status)) {
            throw new error(
                statusCode.BAD_REQUEST,
                statusCode[statusCode.BAD_REQUEST]
            )
        }

        return this.repository.UpdateStatus(status, id, store_id)
    }
}

export default Usecase
