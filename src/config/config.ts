import dotenv from 'dotenv'
import { Config } from './config.interface'
import configValidate from './config.validate'

dotenv.config()

const env = configValidate(process.env)

const config: Config = {
    app: {
        name: env.APP_NAME,
        env: env.APP_ENV,
        port: {
            http: env.APP_PORT_HTTP,
        },
        log: env.APP_LOG,
        prefix: env.APP_PREFIX,
        url: env.APP_URL,
    },
    file: {
        max: Number(env.FILE_MAX) * 1024 * 1024, // MB
        uri: env.FILE_URI,
        type: env.FILE_TYPE,
    },
    db: {
        connection: env.DB_CONNECTION,
        uri: env.DB_URI,
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        name: env.DB_NAME,
        pool: {
            min: env.DB_POOL_MIN,
            max: env.DB_POOL_MAX,
            acquire: env.DB_POOL_ACQUIRE,
            idle: env.DB_POOL_IDLE,
        },
        keep_alive: env.DB_KEEP_ALIVE,
    },
    jwt: {
        access_key: env.JWT_ACCESS_SECRET,
        algorithm: env.JWT_ALGORITHM,
    },
    minio: {
        access_key: env.MINIO_ACCESS_KEY,
        secret_key: env.MINIO_SECRET_KEY,
        endpoint: env.MINIO_ENDPOINT,
        port: env.MINIO_PORT,
        bucket: env.MINIO_BUCKET,
    },
    telegram: {
        url: env.TELEGRAM_URL,
        chat_id: env.TELEGRAM_CHAT_ID,
    },
}

export default config
