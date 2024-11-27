import Joi from 'joi'
import { Login, Store } from './interface'

// define for schema validate
export const StoreSchema = Joi.object<Store>({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
})

export const LoginSchema = Joi.object<Login>({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})
