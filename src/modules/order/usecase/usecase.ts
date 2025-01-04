import error from '../../../pkg/error'
import Logger from '../../../pkg/logger'
import Minio from '../../../pkg/minio'
import statusCode from '../../../pkg/statusCode'
import { Fetch, File, ReceivedOrder, Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'
import { readFileSync } from 'fs'
import Sharp from '../../../pkg/sharp'
import { RequestParams } from '../../../helpers/requestParams'
import { Translate } from '../../../helpers/translate'
import { status } from '../../../database/constant/order'

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
            image.path = `${store_id}/order/${image.filename}`
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
        const store = await this.repository.GetStoreByID(body.store_id)

        if (!store) {
            throw new error(
                statusCode.BAD_REQUEST,
                Translate('not_exists', {
                    attribute: 'Toko',
                })
            )
        }

        const productOrder = await this.repository.getProductOrder(
            body.products,
            body.store_id,
            store.tax,
            store.isTaxBorneCustomer
        )

        body.proof_of_payment = await this.upload(
            body.proof_of_payment,
            body.store_id
        )

        const t = await this.repository.GetTransaction()
        try {
            const order = await this.repository.Store(body, productOrder, t)

            const products = await this.repository.StoreProduct(
                productOrder,
                order.id,
                t
            )

            await this.repository.UpdateStoreBalance(
                body.store_id,
                order.total,
                t
            )

            await this.repository.SyncProducts(products, t)
            await t.commit()
            return order
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    public async Fetch(request: RequestParams<Fetch>, store_id: string) {
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

    public async ReceivedOrder(body: ReceivedOrder, code: string) {
        const result = await this.repository.GetByCode(code)

        if (!result || result?.status !== status.PENDING) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        this.deleteImage(result.proof_of_payment)

        body.proof_of_payment = await this.upload(
            body.proof_of_payment,
            body.store_id
        )

        const t = await this.repository.GetTransaction()

        try {
            await this.repository.ReceivedOrder(body, result.id)
            if (body.status === status.RECEIVED)
                await this.repository.SyncProducts(result.product_orders, t)

            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    private async deleteImage(images: File[]) {
        const paths = images.map((image) => image.path)

        for (const path of paths) {
            await this.minio.Delete(path)
        }
    }
}

export default Usecase
