import Joi from 'joi'
import { Store } from './interface'

// define for schema validate
export const StoreSchema = Joi.object<Store>({
    address: Joi.string().allow('').required(),
    name: Joi.string().required(),
    tax: Joi.number().required(),
    isTaxBorneCustomer: Joi.boolean().required(),
})
