'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class sexo extends Model {
    static associate(models) {
      models.sexo.hasMany(models.persona, {
        foreignKey: 'id_sexo'
      });
      models.sexo.hasMany(models.contacto, {
        as: 'Sexo_contacto',
        foreignKey: 'id_sexo'
      });
      // define association here
    }
  }

  sexo.init({
    id_sexo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_sexo: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'sexo',
    freezeTableName: true
  });
  return sexo;
};