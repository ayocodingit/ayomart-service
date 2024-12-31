export type Store = {
    username: string
    password: string
    phone_number: string
    store_name: string
    code: string
}

export type Login = {
    phone_number: string
    password: string
    store_id: string
}

export type ForgotPassword = {
    phone_number: string
}

export type CreateNewPassword = {
    password: string
}
