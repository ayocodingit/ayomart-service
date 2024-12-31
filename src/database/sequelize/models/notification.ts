import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const Notification = (connection: Connection) => {
    return connection.define(
        'notifications',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expired_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            store_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
}

export default Notification
