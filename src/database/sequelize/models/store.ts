import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const Store = (connection: Connection) => {
    return connection.define(
        'stores',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            logo: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            tax: {
                type: DataTypes.DOUBLE,
                allowNull: true,
                defaultValue: 0,
            },
            isTaxBorneCustomer: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_by: {
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

export default Store
