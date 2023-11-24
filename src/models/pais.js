'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pais extends Model {

    static associate(models) {
      models.pais.hasMany(models.persona,{
        as: 'Pais',foreignKey:'id_pais'
      })
      models.pais.hasMany(models.contacto,{
        as: 'Pais_contacto',foreignKey:'id_pais'
      })
      // define association here
    }
  }
  pais.init({
    id_pais: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_pais: {
      type:DataTypes.STRING(60),
      allowNull: false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'pais',
    freezeTableName: true
  });
  return pais;
};