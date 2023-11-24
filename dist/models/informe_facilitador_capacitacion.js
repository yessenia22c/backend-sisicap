'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class informe_facilitador_capacitacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.informe_facilitador_capacitacion.belongsTo(models.facilitador, {
        as: 'Facilitadores',
        foreignKey: 'id_facilitador'
      });
      models.informe_facilitador_capacitacion.belongsTo(models.capacitacion, {
        as: 'Capacitacion_dada',
        foreignKey: 'id_capacitacion'
      });
      // define association here
    }
  }

  informe_facilitador_capacitacion.init({
    id_facilitador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_capacitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'informe_facilitador_capacitacion',
    freezeTableName: true
  });
  return informe_facilitador_capacitacion;
};