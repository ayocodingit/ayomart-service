import { role, status } from '../../../database/constant/user'
import { ACTION } from '../../../database/constant/notification'
import Telegram from '../../../external/telegram'
import { Translate } from '../../../helpers/translate'
import { generatePassword, isMatchPassword } from '../../../pkg/bcrypt'
import error from '../../../pkg/error'
import Jwt from '../../../pkg/jwt'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { Login, Store } from '../entity/interface'
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

            const user = await this.repository.CreateUser(body, t)
            body.created_by = user.id

            const store = await this.repository.CreateStore(body, t)
            const verification = await this.repository.CreateVerification(
                user.id,
                store.id,
                generateCode('verification'),
                t
            )
            const path = 'auth/verify/' + verification.code

            const message = this.telegram.Template({
                ...verification.dataValues,
                action: ACTION.SIGNUP,
                ...user.dataValues,
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
                store_id: user.store_id,
            })
        }

        const access_token = this.jwt.Sign(payload, {
            expiresIn: '4h',
        })

        return access_token
    }

    public async Verify(id: string) {
        const notification = await this.repository.GetNotification(id)

        if (!notification) {
            throw new error(
                statusCode.NOT_FOUND,
                statusCode[statusCode.NOT_FOUND]
            )
        }

        this.repository.UpdateIsReadNotification(id, true)

        return this.repository.UpdateStatus(
            notification.created_by,
            status.VERIFIED
        )
    }
}

export default Usecase
