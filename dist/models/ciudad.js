'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ciudad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ciudad.hasMany(models.persona, {
        foreignKey: 'id_ciudad'
      });
      models.ciudad.hasMany(models.contacto, {
        as: 'Ciudad_contacto',
        foreignKey: 'id_ciudad'
      });
      // define association here
    }
  }

  ciudad.init({
    id_ciudad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_ciudad: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'ciudad',
    freezeTableName: true
  });
  return ciudad;
};