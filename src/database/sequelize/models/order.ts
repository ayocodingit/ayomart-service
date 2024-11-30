import { DataTypes } from 'sequelize'
import { Connection } from '../interface'
import { order_type, payment_method, status } from '../../constant/order'

const Order = (connection: Connection) => {
    return connection.define(
        'orders',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            paid: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            total: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            change_money: {
                type: DataTypes.DOUBLE,
                allowNull: true,
            },
            discount: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pickup_time: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            order_type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: order_type.CASHIER,
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: payment_method.CASH,
            },
            proof_of_payment: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            tax: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            isTaxBorneCustomer: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: status.RECEIVED,
            },
            received_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            store_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
}

export default Order
