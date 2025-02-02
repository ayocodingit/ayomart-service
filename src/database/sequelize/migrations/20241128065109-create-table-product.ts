'use strict'

import sequelize from 'sequelize'
import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('products', {
                id: {
                    primaryKey: true,
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                code: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                unit: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                category: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                price: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                    defaultValue: 0,
                },
                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
                discount: {
                    type: DataTypes.DOUBLE,
                    allowNull: false,
                    defaultValue: 0,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                images: {
                    type: DataTypes.JSON,
                    allowNull: false,
                    defaultValue: JSON.stringify([]),
                },
                created_by: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                store_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                },
                is_active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
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
                    .addIndex('products', ['code', 'name', 'category'])
                    .then(() => {
                        return queryInterface.addIndex('products', [
                            'store_id',
                            'created_by',
                        ])
                    })
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('products')
    },
}
