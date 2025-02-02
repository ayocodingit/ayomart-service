import { Client } from 'minio'
import { Config } from '../config/config.interface'

class Minio {
    private client
    private minio
    constructor(private config: Config) {
        this.minio = config.minio
        this.client = new Client({
            endPoint: this.minio.endpoint,
            port: this.minio.port,
            useSSL: false,
            accessKey: this.minio.access_key,
            secretKey: this.minio.secret_key,
        })
    }

    public async Upload(
        path: string,
        source: Buffer,
        size: number,
        mimetype: string
    ) {
        try {
            await this.client.putObject(this.minio.bucket, path, source, size, {
                'Content-Type': mimetype,
            })
            return this.config.file.uri + path
        } catch (error) {
            throw error
        }
    }

    public async Delete(path: string) {
        return this.client.removeObject(this.minio.bucket, path, {
            forceDelete: true,
        })
    }
}

export default Minio
