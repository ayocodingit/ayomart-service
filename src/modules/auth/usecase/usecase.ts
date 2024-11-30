import { status } from '../../../database/constant/user'
import { Translate } from '../../../helpers/translate'
import { generatePassword, isMatchPassword } from '../../../pkg/bcrypt'
import error from '../../../pkg/error'
import Jwt from '../../../pkg/jwt'
import Logger from '../../../pkg/logger'
import statusCode from '../../../pkg/statusCode'
import { Login, Store } from '../entity/interface'
import Repository from '../repository/postgresql/repository'

class Usecase {
    constructor(
        private logger: Logger,
        private repository: Repository,
        private jwt: Jwt
    ) {}

    public async Store(body: Store) {
        const t = await this.repository.GetTransaction()
        try {
            body.password = await generatePassword(body.password, 10)

            const email = await this.repository.GetByEmail(body.email)
            if (email)
                throw new error(
                    statusCode.UNPROCESSABLE_ENTITY,
                    JSON.stringify({
                        email: Translate('exists', {
                            attribute: 'email',
                        }),
                    }),
                    true
                )

            const user = await this.repository.CreateUser(body, t)
            body.created_by = user.id

            await this.repository.CreateStore(body, t)
            await t.commit()
        } catch (error) {
            await t.rollback()
            throw error
        }
    }

    public async Login(body: Login) {
        const user = await this.repository.GetByEmail(body.email)

        if (!user) {
            throw new error(
                statusCode.UNAUTHORIZED,
                'email atau kata sandi salah'
            )
        }

        if (!(await isMatchPassword(body.password, user.password))) {
            throw new error(
                statusCode.UNAUTHORIZED,
                'email atau kata sandi salah'
            )
        }

        if (user.status !== status.VERIFIED) {
            throw new error(
                statusCode.FORBIDDEN,
                'akun anda belum terverifikasi'
            )
        }

        const access_token = this.jwt.Sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                store: {
                    id: user.store.id,
                    name: user.store.name,
                },
            },
            {
                expiresIn: '4h',
            }
        )

        return access_token
    }
}

export default Usecase
