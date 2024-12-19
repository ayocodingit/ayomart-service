'use strict'

import sequelize from 'sequelize'
import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('customers', {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
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
                return queryInterface
                    .addIndex('customers', ['name', 'phone_number'])
                    .then(() => {
                        return queryInterface.addIndex('customers', [
                            'store_id',
                        ])
                    })
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('customers')
    },
}
