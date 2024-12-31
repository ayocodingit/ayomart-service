'use strict'

import sequelize from 'sequelize'
import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('notifications', {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
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
                return queryInterface.addIndex('notifications', [
                    'created_by',
                    'store_id',
                    'is_read',
                    'code',
                ])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('notifications')
    },
}
