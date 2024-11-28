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
        filename: string,
        source: Buffer,
        size: number,
        mimetype: string
    ) {
        try {
            await this.client.putObject(
                this.minio.bucket,
                filename,
                source,
                size,
                {
                    'Content-Type': mimetype,
                }
            )
            return this.config.file.uri + '/' + filename
        } catch (error) {
            throw error
        }
    }
}

export default Minio
