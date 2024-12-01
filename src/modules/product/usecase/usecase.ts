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

    private async validateName(name: string, store_id: string, id?: string) {
        const product = await this.repository.GetByName(name, store_id, id)

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
    }

    public async Store(body: Store) {
        body.images = await this.upload(body.images, body.store_id)

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

    private async deleteImage(images: File[]) {
        const paths = images.map((image) => image.path)

        for (const path of paths) {
            await this.minio.Delete(path)
        }
    }

    public async Update(body: Store, id: string) {
        const result = await this.repository.GetByID(id)

        if (!result) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        await this.validateName(body.name, body.store_id, id)

        this.deleteImage(result.images)
        body.images = await this.upload(body.images, body.store_id)

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

        this.deleteImage(result.images)
        return this.repository.Delete(id)
    }

    public async GetCategories(store_id: string) {
        return this.repository.GetCategories(store_id)
    }
}

export default Usecase
