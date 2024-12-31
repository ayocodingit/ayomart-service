import Joi from 'joi'
import { CreateNewPassword, ForgotPassword, Login, Store } from './interface'
import { RegexNumber } from '../../../helpers/regex'

// define for schema validate
export const StoreSchema = Joi.object<Store>({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().regex(RegexNumber).min(6).max(15).required(),
    store_name: Joi.string().required(),
})

export const LoginSchema = Joi.object<Login>({
    phone_number: Joi.string().required(),
    password: Joi.string().required(),
    store_id: Joi.string().optional(),
})

export const ForgotPasswordSchema = Joi.object<ForgotPassword>({
    phone_number: Joi.string().required(),
})

export const CreateNewPasswordSchema = Joi.object<CreateNewPassword>({
    password: Joi.string().min(6).required(),
})
