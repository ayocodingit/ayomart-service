'use strict'

import sequelize from 'sequelize'
import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('product_order', {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                order_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                product_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                qty: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                total: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                note: {
                    type: DataTypes.STRING,
                    allowNull: true,
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
                return queryInterface.addIndex('product_order', [
                    'order_id',
                    'product_id',
                ])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('product_order')
    },
}
