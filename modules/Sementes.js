const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Sementes = db.define('sementes', {
    nome: {
        type: DataTypes.STRING(99)
    },
    precoUnitario: {
        type: DataTypes.DOUBLE
    },
    quantidadeEstoque: {
        type: DataTypes.INTEGER
    }
},{
    createdAt: false,
    updatedAt: false
})

//Sementes.sync({force:true})
module.exports = Sementes