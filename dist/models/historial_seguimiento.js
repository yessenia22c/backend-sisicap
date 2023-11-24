'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class historial_seguimiento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.historial_seguimiento.belongsTo(models.historico_llamadas, {
        as: 'Historial',
        foreignKey: 'id_historico'
      });
    }
  }
  historial_seguimiento.init({
    id_historial_seguimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_historico: DataTypes.INTEGER,
    observacion_llamada: DataTypes.STRING,
    fecha_seguimiento: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'historial_seguimiento',
    freezeTableName: true
  });
  return historial_seguimiento;
};