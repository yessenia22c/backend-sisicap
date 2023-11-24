'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tipo_seguimiento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.tipo_seguimiento.hasMany(models.historico_llamadas, {
        as: 'TipoSeguimiento',
        foreignKey: 'id_tipo_seguimiento'
      });
    }
  }
  tipo_seguimiento.init({
    id_tipo_seguimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_tipo_seguimiento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre del tipo de seguimiento.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'tipo_seguimiento',
    freezeTableName: true
  });
  return tipo_seguimiento;
};