import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const Customer = (connection: Connection) => {
    return connection.define(
        'customers',
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
            debt: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 0,
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
