import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import {
    CreateNewPasswordSchema,
    ForgotPasswordSchema,
    LoginSchema,
    StoreSchema,
} from '../../entity/schema'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Store = async (req: any, res: Response, next: NextFunction) => {
        try {
            const body = ValidateFormRequest(StoreSchema, req.body)
            const result = await this.usecase.Store(body)
            this.logger.Info(statusCode[statusCode.CREATED], {
                additional_info: this.http.AdditionalInfo(
                    req,
                    statusCode.CREATED
                ),
            })
            return res
                .status(statusCode.CREATED)
                .json({ data: result, message: 'CREATED' })
        } catch (error) {
            return next(error)
        }
    }

    public Login = async (req: any, res: Response, next: NextFunction) => {
        try {
            const body = ValidateFormRequest(LoginSchema, req.body)
            const access_token = await this.usecase.Login(body)
            this.logger.Info(statusCode[statusCode.CREATED], {
                additional_info: this.http.AdditionalInfo(
                    req,
                    statusCode.CREATED
                ),
            })
            return res.status(statusCode.CREATED).json({
                data: {
                    access_token,
                },
            })
        } catch (error) {
            return next(error)
        }
    }

    public ForgotPassword = async (
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const body = ValidateFormRequest(ForgotPasswordSchema, req.body)
            await this.usecase.ForgotPassword(body)
            this.logger.Info(statusCode[statusCode.CREATED], {
                additional_info: this.http.AdditionalInfo(
                    req,
                    statusCode.CREATED
                ),
            })
            return res.status(statusCode.CREATED).json({
                message: 'CREATED',
            })
        } catch (error) {
            return next(error)
        }
    }

    public Me = async (req: any, res: Response, next: NextFunction) => {
        try {
            this.logger.Info(statusCode[statusCode.CREATED], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })
            return res.status(statusCode.OK).json({
                data: {
                    ...req.user,
                },
            })
        } catch (error) {
            return next(error)
        }
    }

    public Verify = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.usecase.Verify(req.params.id)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })
            return res.status(statusCode.OK).json({
                message: 'UPDATED',
            })
        } catch (error) {
            return next(error)
        }
    }

    public CreateNewPassword = async (
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const body = ValidateFormRequest(CreateNewPasswordSchema, req.body)
            await this.usecase.CreateNewPassword(req.params.code, body.password)

            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })
            return res.status(statusCode.OK).json({
                message: 'UPDATED',
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default Handler
