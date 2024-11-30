import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const ProductOrder = (connection: Connection) => {
    return connection.define(
        'product_order',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            order_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            qty: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            price: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            discount: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            voucher: {
                type: DataTypes.DOUBLE,
                allowNull: false,
            },
            unit: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            tableName: 'product_order',
        }
    )
}

export default ProductOrder
