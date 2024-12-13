'use strict'

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
            })
            .then(() => {
                return queryInterface.addIndex('notifications', [
                    'action',
                    'created_by',
                    'store_id',
                    'is_read'
                ])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('notifications')
    },
}
