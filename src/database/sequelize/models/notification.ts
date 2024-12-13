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
            action: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            expired_at: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            store_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            is_read: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            timestamps: false,
        }
    )
}

export default Notification
