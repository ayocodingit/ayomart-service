import { DataTypes } from 'sequelize'
import { Connection } from '../interface'

const Verification = (connection: Connection) => {
    return connection.define(
        'verifications',
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
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
        },
        {
            timestamps: false,
        }
    )
}

export default Verification
