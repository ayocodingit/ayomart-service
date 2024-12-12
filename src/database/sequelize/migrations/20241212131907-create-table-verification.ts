'use strict'

import { DataTypes, QueryInterface } from 'sequelize'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface: QueryInterface) {
        return queryInterface
            .createTable('verifications', {
                id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
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
            })
            .then(() => {
                return queryInterface.addIndex('verifications', [
                    'email',
                    'action',
                ])
            })
    },

    async down(queryInterface: QueryInterface) {
        return queryInterface.dropTable('verifications')
    },
}
