export type File = {
    path: string
    size: number
    mimetype: string
    originalname: string
    filename: string
    uri: string
}

export type Store = {
    code: string
    name: string
    unit: string
    category: string
    price: number
    grosir_price: number
    stock: number
    discount: number
    description: string
    created_by: string
    store_id: string
    images: File[]
}
