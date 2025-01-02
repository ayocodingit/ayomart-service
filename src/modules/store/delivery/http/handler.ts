import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { StoreSchema } from '../../entity/schema'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Show = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = await this.usecase.Show(req.params.id)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })

            return res.json({ data })
        } catch (error) {
            return next(error)
        }
    }

    public Update = async (req: any, res: Response, next: NextFunction) => {
        try {
            const body = ValidateFormRequest(StoreSchema, {
                ...req.body,
            })

            await this.usecase.Update(body, req.params.id)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })
            return res.status(statusCode.OK).json({ message: 'UPDATED' })
        } catch (error) {
            return next(error)
        }
    }
}

export default Handler
