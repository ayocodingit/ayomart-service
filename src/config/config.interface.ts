export type Config = {
    app: {
        name: string
        env: string
        port: {
            http: number
        }
        log: string
        prefix: string
        url: string
    }
    file: {
        max: number
        uri: string
        type: string[]
    }
    db: {
        connection: string
        uri: string
        host: string
        port: number
        username: string
        password: string
        name: string
        pool: {
            min: number
            max: number
            acquire: number
            idle: number
        }
        keep_alive: boolean
    }
    jwt: {
        access_key: string
        algorithm: string
    }
    minio: {
        endpoint: string
        access_key: string
        secret_key: string
        bucket: string
        port: number
    }
    telegram: {
        url: string
        chat_id: string
    }
}
