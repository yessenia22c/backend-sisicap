'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class empresa_empleadora extends Model {
    static associate(models) {
      models.empresa_empleadora.hasMany(models.empleado,{
        foreignKey:'id_empresa_empleadora'
      })
    }
  }
  empresa_empleadora.init({
    id_empresa: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_empleador: {
      type:DataTypes.STRING(80),
      allowNull:false
    },
    ubicacion: DataTypes.STRING(100),
    correo_empleador: DataTypes.STRING(80),
    sitio_web: DataTypes.STRING(80),
    telefono_contacto: {
      type:DataTypes.STRING(15),
      allowNull:false
    },
    nit_empresa: DataTypes.STRING(50),
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'empresa_empleadora',
    freezeTableName: true
  });
  return empresa_empleadora;
};