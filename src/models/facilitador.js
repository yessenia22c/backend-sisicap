'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class facilitador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.facilitador.belongsTo(models.persona,{
        as:'PersonaFacilitador',foreignKey:'id_persona'
      })

      models.facilitador.hasMany(models.informe_facilitador_capacitacion,{
        as: 'Facilitadores',foreignKey:'id_facilitador'
      })
    }
  }
  facilitador.init({
    id_facilitador: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_persona: {
      type:DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Debes registrar el dato personal primero'
        }
      }
    },
    profesion: {
      type:DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La profesión es un dato obligatorio'
        }
      }
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'facilitador',
    freezeTableName: true
  });
  return facilitador;
};
