'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class participante extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.participante.belongsTo(models.usuario, {
        foreignKey: 'id_registrante'
      });
      //Revisar despues.
      models.participante.belongsTo(models.persona, {
        as: 'Personas',
        foreignKey: 'id_persona'
      });
      // define association here
      models.participante.hasMany(models.informe_inscripciones, {
        as: 'Participantes',
        foreignKey: 'id_participante'
      });
    }
  }
  participante.init({
    id_participante: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_registrante: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Debes registrar el dato personal primero'
        }
      }
    },
    ocupacion: DataTypes.STRING(80),
    codigo_participante: {
      type: DataTypes.INTEGER(15),
      unique: true
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'participante',
    freezeTableName: true
  });
  return participante;
};