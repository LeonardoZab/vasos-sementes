const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Potes = db.define('potes', {
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

//Potes.sync({force:true})
module.exports = Potes