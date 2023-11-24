'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class informe_inscripciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.informe_inscripciones.belongsTo(models.participante, {
        as: 'Participantes',
        foreignKey: 'id_participante'
      });
      models.informe_inscripciones.belongsTo(models.capacitacion, {
        as: 'Capacitaciones',
        foreignKey: 'id_capacitacion'
      });
    }
  }
  informe_inscripciones.init({
    id_inscripcion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_participante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor seleciona al participante a inscribir.'
        }
      }
    },
    id_capacitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor seleciona la capacitacion.'
        }
      }
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'informe_inscripciones',
    freezeTableName: true
  });
  return informe_inscripciones;
};