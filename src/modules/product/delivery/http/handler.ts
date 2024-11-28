import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { StoreSchema } from '../../entity/schema'
import { unlinkSync } from 'fs'

class Handler {
    constructor(
        private logger: Logger,
        private http: Http,
        private usecase: Usecase
    ) {}

    public Store = async (req: any, res: Response, next: NextFunction) => {
        try {
            const body = ValidateFormRequest(StoreSchema, {
                ...req.body,
                images: req.files,
            })
            body.created_by = req.user.id

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
        } finally {
            if (req.files) {
                req.files.map((file: any) => {
                    unlinkSync(this.http.dest + '/' + file.filename)
                })
            }
        }
    }
}

export default Handler
