'use strict'

import sequelize from 'sequelize'
import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('stores', {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                address: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                is_active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                },
                logo: {
                    type: DataTypes.JSON,
                    allowNull: true,
                },
                tax: {
                    type: DataTypes.DOUBLE,
                    allowNull: true,
                    defaultValue: 0,
                },
                isTaxBorneCustomer: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                balance: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                    defaultValue: 0,
                },
                debt: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                    defaultValue: 0,
                },
                code: {
                    type: DataTypes.STRING,
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
                return queryInterface.addIndex('stores', ['name', 'code'])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('stores')
    },
}
