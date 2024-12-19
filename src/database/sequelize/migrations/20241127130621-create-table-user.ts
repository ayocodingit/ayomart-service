'use strict'

import { DataTypes, QueryInterface } from 'sequelize'
import { role, status } from '../../constant/user'
import sequelize from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('users', {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                phone_number: {
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
                    defaultValue: role.OWNER,
                },
                store_id: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: status.PENDING,
                },
                created_at: {
                    type: DataTypes.DATE,
                    defaultValue: sequelize.fn('NOW'),
                },
                updated_at: {
                    type: DataTypes.DATE,
                    defaultValue: sequelize.fn('NOW'),
                },
            })
            .then(() => {
                return queryInterface.addIndex('users', ['phone_number'])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('users')
    },
}
