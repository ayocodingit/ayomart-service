import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { StoreSchema } from '../../entity/schema'
import { unlinkSync } from 'fs'
import { GetMeta, GetRequest } from '../../../../helpers/requestParams'

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
            })
            body.store_id = req.store_id

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

    public Fetch = async (req: any, res: Response, next: NextFunction) => {
        try {
            const store_id = req.store_id
            const request = GetRequest<{}>(req.query)
            const { data, count } = await this.usecase.Fetch(request, store_id)

            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })

            return res.json({ data, meta: GetMeta(request, count) })
        } catch (error) {
            return next(error)
        }
    }

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

    public Destroy = async (req: any, res: Response, next: NextFunction) => {
        try {
            const data = await this.usecase.Destroy(req.params.id)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })

            return res.json({ data })
        } catch (error) {
            return next(error)
        }
    }
}

export default Handler
