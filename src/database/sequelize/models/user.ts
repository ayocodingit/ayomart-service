import { DataTypes } from 'sequelize'
import { Connection } from '../interface'
import { role, status } from '../../constant/user'

const User = (connection: Connection) => {
    return connection.define(
        'users',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: role.SELLER,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: status.PENDING,
            },
        },
        {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
}

export default User
