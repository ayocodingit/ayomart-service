import { Config } from '../../config/config.interface'
import Logger from '../../pkg/logger'
import { Sequelize as createConnection, Dialect, Op } from 'sequelize'
import { Connection } from './interface'
import User from './models/user'
import Store from './models/store'
import Product from './models/product'
import Order from './models/order'
import Customer from './models/customer'
import ProductOrder from './models/productOrder'
import Notification from './models/notification'

class Sequalize {
    public static async Connect({ db }: Config, logger: Logger) {
        const connection = new createConnection({
            logging: false,
            dialect: db.connection as Dialect,
            username: db.username,
            password: db.password,
            host: db.host,
            port: db.port,
            database: db.name,
            pool: {
                min: db.pool.min,
                max: db.pool.max,
                acquire: db.pool.acquire,
                idle: db.pool.idle,
            },
        })

        try {
            await connection.authenticate()
            logger.Info('Sequelize connection to database established')
        } catch (error: any) {
            logger.Error('Sequelize connection error: ' + error.message)
            process.exit(-1)
        }

        return connection
    }

    public static Models = (connection: Connection) => {
        // load all model on folder models
        const user = User(connection)
        const store = Store(connection)
        const product = Product(connection)
        const order = Order(connection)
        const customer = Customer(connection)
        const productOrder = ProductOrder(connection)
        const notification = Notification(connection)

        user.hasMany(store, {
            foreignKey: 'created_by',
        })

        order.hasMany(productOrder, {
            foreignKey: 'order_id',
        })

        // setup relation for eager loader in here
        // example: User.hasOne(Profile)
        return {
            user,
            store,
            product,
            order,
            customer,
            productOrder,
            notification,
            // Add other models if needed
            // ...

            // Add other require of the driver database
            connection,
            Op,
        }
    }

    public static Disconnect = (connection: Connection) => {
        return connection.close()
    }
}

export default Sequalize
