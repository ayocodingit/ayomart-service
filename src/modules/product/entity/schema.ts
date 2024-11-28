import Joi from 'joi'
import { Store } from './interface'
import config from '../../../config/config'

const file = Joi.object({
    path: Joi.string().required(),
    size: Joi.number().max(config.file.max).required(),
    mimetype: Joi.string()
        .valid(...config.file.type)
        .required(),
    originalname: Joi.string().required(),
    filename: Joi.string().required(),
})

// define for schema validate
export const StoreSchema = Joi.object<Store>({
    code: Joi.string().optional(),
    name: Joi.string().required(),
    unit: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    grosir_price: Joi.number().required(),
    stock: Joi.number().required(),
    discount: Joi.number().required(),
    description: Joi.string().required(),
    images: Joi.array().items(file).min(1),
})
