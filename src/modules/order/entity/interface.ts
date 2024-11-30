export type File = {
    path: string
    size: number
    mimetype: string
    originalname: string
    filename: string
    uri: string
}

export type Product = {
    name: string
    unit: string
    price: number
    discount: number
    voucher: number
    note: string
    qty: number
}

export type ProductOrder = {
    products: Product[]
    total: number
    discount: number
    tax: number
}

export type StoreProduct = {
    id: string
    note: string
    qty: number
}

export type Store = {
    paid: number
    note: string
    pickup_time: Date
    order_type: string
    payment_method: string
    proof_of_payment: File[]
    store_id: string
    customer_id: string
    received_by: string
    status: string
    products: StoreProduct[]
}

export type Fetch = {
    status: string
    start_date: string
    end_date: string
}
