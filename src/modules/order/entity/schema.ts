import Joi from 'joi'
import { ReceivedOrder, Store } from './interface'
import config from '../../../config/config'
import {
    order_type,
    payment_method,
    status,
} from '../../../database/constant/order'
import { startOfDay } from 'date-fns'

const file = Joi.object({
    path: Joi.string().required(),
    size: Joi.number().max(config.file.max).required(),
    mimetype: Joi.string()
        .valid(...config.file.type)
        .required(),
    originalname: Joi.string().required(),
    filename: Joi.string().required(),
})

const products = Joi.array()
    .items(
        Joi.object({
            id: Joi.string().required(),
            note: Joi.string().required().allow(''),
            qty: Joi.number().min(1).required(),
        })
    )
    .min(1)

// define for schema validate
export const StoreSchema = Joi.object<Store>({
    paid: Joi.number().when('order_type', {
        is: order_type.CASHIER,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }),
    note: Joi.string().required().allow(''),
    order_type: Joi.string()
        .valid(...Object.values(order_type))
        .required(),
    pickup_time: Joi.date()
        .max('now')
        .min(startOfDay(new Date()))
        .when('order_type', {
            is: order_type.PICKUP,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    payment_method: Joi.string()
        .valid(...Object.values(payment_method))
        .required(),
    proof_of_payment: Joi.array().items(file).optional().default([]),
    store_id: Joi.number().when('order_type', {
        is: order_type.PICKUP,
        then: Joi.required(),
        otherwise: Joi.forbidden(),
    }),
    customer_id: Joi.string().optional(),
    products,
})

export const ReceivedSchema = Joi.object<ReceivedOrder>({
    paid: Joi.number().when('status', {
        is: status.RECEIVED,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    payment_method: Joi.string()
        .valid(...Object.values(payment_method))
        .when('status', {
            is: status.RECEIVED,
            then: Joi.required(),
            otherwise: Joi.optional(),
        }),
    note: Joi.string().required().allow(''),
    proof_of_payment: Joi.array().items(file).optional().default([]),
    status: Joi.string().valid(status.RECEIVED, status.REJECTED).required(),
})
