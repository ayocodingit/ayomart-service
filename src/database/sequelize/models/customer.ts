import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const Customer = (connection: Connection) => {
    return connection.define(
        'orders',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone_number: {
                type: DataTypes.STRING,
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

export default Customer
