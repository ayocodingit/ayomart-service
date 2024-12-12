import { ModelStatic, Sequelize, Op } from 'sequelize'

export type Model = ModelStatic<any>

export type Schema = {
    store: Model
    user: Model
    product: Model
    order: Model
    customer: Model
    productOrder: Model
    verification: Model
    // Add other models if needed
    // ...

    // Add other require of the driver database
    connection: Connection
    Op: typeof Op
}

export type Connection = Sequelize
