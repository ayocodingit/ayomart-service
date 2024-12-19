import Joi from 'joi'
import { Store } from './interface'

// define for schema validate
export const StoreSchema = Joi.object<Store>({
    debt: Joi.number().required(),
    name: Joi.string().required(),
    phone_number: Joi.string().optional(),
})
