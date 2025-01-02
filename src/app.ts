import config from './config/config'
import Sequelize from './database/sequelize/sequelize'
import Auth from './modules/auth/auth'
import Customer from './modules/customer/customer'
import Order from './modules/order/order'
import Product from './modules/product/product'
import Store from './modules/store/store'
import Logger from './pkg/logger'
import Http from './transport/http/http'

const Run = async () => {
    const logger = new Logger(config)
    const connection = await Sequelize.Connect(config, logger)

    const http = new Http(logger, config)

    // Start Load Module
    new Auth(logger, config, connection).RunHttp(http)
    new Product(logger, config, connection).RunHttp(http)
    new Order(logger, config, connection).RunHttp(http)
    new Customer(logger, config, connection).RunHttp(http)
    new Store(logger, config, connection).RunHttp(http)
    // End Load Module

    http.Run(config.app.port.http)

    return {
        http,
        connection,
    }
}

export default Run()
