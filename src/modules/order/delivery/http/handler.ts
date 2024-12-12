import Http from '../../../../transport/http/http'
import Logger from '../../../../pkg/logger'
import Usecase from '../../usecase/usecase'
import { NextFunction, Response } from 'express'
import statusCode from '../../../../pkg/statusCode'
import { ValidateFormRequest } from '../../../../helpers/validate'
import { ReceivedSchema, StoreSchema } from '../../entity/schema'
import { unlinkSync } from 'fs'
import { GetMeta, GetRequest } from '../../../../helpers/requestParams'
import { Fetch } from '../../entity/interface'
import { status } from '../../../../database/constant/order'

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
                proof_of_payment: req.files,
            })

            body.store_id = req.query.query ?? req.user.stores[0].id

            if (req.user) {
                body.received_by = req.user.id
                body.status = status.RECEIVED
            }

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

    public Fetch = async (req: any, res: Response, next: NextFunction) => {
        try {
            const request = GetRequest<Fetch>(req.query)
            const { data, count } = await this.usecase.Fetch(
                request,
                req.query.query ?? req.user.stores[0].id
            )
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

    public ReceivedOrder = async (
        req: any,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const body = ValidateFormRequest(ReceivedSchema, {
                ...req.body,
                proof_of_payment: req.files,
            })
            body.received_by = req.user.id
            body.store_id = req.query.query ?? req.user.stores[0].id

            if (body.status === status.RECEIVED)
                body.pickup_time_at = new Date()

            await this.usecase.ReceivedOrder(body, req.params.code)
            this.logger.Info(statusCode[statusCode.OK], {
                additional_info: this.http.AdditionalInfo(req, statusCode.OK),
            })

            return res.json({ message: 'UPDATED' })
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
