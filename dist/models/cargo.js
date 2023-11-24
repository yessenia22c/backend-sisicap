'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cargo extends Model {
    static associate(models) {
      models.cargo.hasMany(models.empleado, {
        foreignKey: 'id_cargo'
      });
      // define association here
    }
  }

  cargo.init({
    id_cargo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_cargo: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'cargo',
    freezeTableName: true
  });
  return cargo;
};