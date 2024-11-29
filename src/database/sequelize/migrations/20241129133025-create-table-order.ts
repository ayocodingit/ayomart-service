'use strict'

import sequelize from 'sequelize'
import { DataTypes, QueryInterface } from 'sequelize'
import { order_type, payment_method, status } from '../../constant/order'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('orders', {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                queue: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                code: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                total: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                change_money: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                discount: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                note: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                pickup_time: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                order_type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: order_type.CASHIER,
                },
                payment_method: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: payment_method.CASH,
                },
                proof_of_payment: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                tax: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                customer_id: {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    defaultValue: status.RECEIVED,
                },
                created_by: {
                    type: DataTypes.UUID,
                    allowNull: false,
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
                return queryInterface.addIndex('orders', [
                    'code',
                    'order_type',
                    'status',
                ])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('orders')
    },
}
