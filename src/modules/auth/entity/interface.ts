export type Store = {
    username: string
    password: string
    phone_number: string
    store_name: string
    created_by: string
}

export type Login = {
    phone_number: string
    password: string
    store_id: string
}
