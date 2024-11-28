import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const Product = (connection: Connection) => {
    return connection.define(
        'products',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            unit: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            grosir_price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            discount: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            images: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: JSON.stringify([]),
            },
            created_by: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
}

export default Product
