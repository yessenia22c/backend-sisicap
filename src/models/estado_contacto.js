'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class estado_contacto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.estado_contacto.hasMany(models.contacto,{
        as: 'Estado',foreignKey:'id_estado_contacto'
      })
    }
  }
  estado_contacto.init({
    id_estado_contacto: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_estado: {
      type:DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre del estado contacto.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'estado_contacto',
    freezeTableName: true
  });
  return estado_contacto;
};