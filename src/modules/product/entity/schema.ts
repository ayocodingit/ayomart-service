import Joi from 'joi'
import { Store } from './interface'

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
    images: Joi.array().items(Joi.string().required()).min(1),
})
