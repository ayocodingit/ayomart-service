import { role, status } from '../../../database/constant/user'
import { ACTION } from '../../../database/constant/notification'
import Telegram from '../../../external/telegram'
import { Translate } from '../../../helpers/translate'
import { generatePassword, isMatchPassword } from '../../../pkg/bcrypt'
import error from '../../../pkg/error'
import Jwt from '../../../pkg/jwt'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { ForgotPassword, Login, Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'
import generateCode from '../../../helpers/generator'

class Usecase {
    constructor(
        private logger: Logger,
        private repository: Repository,
        private jwt: Jwt,
        private telegram: Telegram
    ) {}

    public async Store(body: Store) {
        const t = await this.repository.GetTransaction()
        try {
            const exist = await this.repository.GetByPhoneNumber(
                body.phone_number
            )
            if (exist)
                throw new error(
                    statusCode.BAD_REQUEST,
                    Translate('exists', {
                        attribute: 'nomor hp',
                    })
                )

            body.password = await generatePassword(body.password, 10)
            body.code = generateCode('store')

            const user = await this.repository.CreateUser(body, t)

            const store = await this.repository.CreateStore(body, t)
            const notification = await this.repository.CreateNotification(
                user.id,
                store.id,
                generateCode('verification'),
                t
            )
            const path = 'auth/verify/' + notification.code

            const message = this.telegram.Template({
                action: ACTION.SIGNUP,
                ...user.dataValues,
                ...notification.dataValues,
                path,
            })

            await this.telegram.SendMessage(message)
            await t.commit()
        } catch (error) {
            await t.rollback()

            throw error
        }
    }

    public async Login(body: Login) {
        const user = await this.repository.GetByPhoneNumber(body.phone_number)

        if (!user) {
            throw new error(
                statusCode.UNAUTHORIZED,
                'nomor hp atau kata sandi salah'
            )
        }

        if (!(await isMatchPassword(body.password, user.password))) {
            throw new error(
                statusCode.UNAUTHORIZED,
                'nomor hp atau kata sandi salah'
            )
        }

        if (user.status !== status.VERIFIED) {
            throw new error(
                statusCode.FORBIDDEN,
                'akun anda belum terverifikasi'
            )
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            stores: user.stores,
        }

        if (user.role === role.EMPLOYEE && user.store_id) {
            Object.assign(payload, {
                store: user.stores.find(
                    (store: any) => store.id === user.store_id
                ),
            })
        }

        if (
            user.role === role.OWNER &&
            user.stores.find((store: any) => store.id === body.store_id)
        ) {
            Object.assign(payload, {
                store: user.stores.find(
                    (store: any) => store.id === body.store_id
                ),
            })
        }

        if (user.role === role.OWNER && user.stores.length === 1) {
            Object.assign(payload, {
                store: user.stores[0],
            })
        }

        const access_token = this.jwt.Sign(payload, {
            expiresIn: '4h',
        })

        return access_token
    }
    public async ForgotPassword(body: ForgotPassword) {
        const user = await this.repository.GetByPhoneNumber(body.phone_number)

        if (!user) {
            throw new error(statusCode.NOT_FOUND, 'nomor hp tidak ditemukan')
        }

        const notification = await this.repository.CreateNotification(
            user.id,
            null,
            generateCode('password_reset')
        )
        const path = 'auth/create-new-password/' + notification.code

        const message = this.telegram.Template({
            action: ACTION.FORGOT_PASSWORD,
            ...user.dataValues,
            ...notification.dataValues,
            path,
        })

        await this.telegram.SendMessage(message)

        return notification
    }

    public async Verify(code: string) {
        const notification = await this.repository.GetNotification(code)

        if (!notification) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        this.repository.UpdateIsReadNotification(code, true)

        return this.repository.UpdateStatus(
            notification.created_by,
            status.VERIFIED
        )
    }

    public async CreateNewPassword(code: string, password: string) {
        const notification = await this.repository.GetNotification(code)

        if (!notification) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        this.repository.UpdateIsReadNotification(code, true)

        password = await generatePassword(password, 10)

        return this.repository.UpdatePassword(notification.created_by, password)
    }

    public async GetStoreByID(id: string) {
        return this.repository.GetStoreByID(id)
    }
}

export default Usecase
