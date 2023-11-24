'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class historico_llamadas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.historico_llamadas.belongsTo(models.contacto,{
        as: 'Contactos',foreignKey:'id_contacto'
      })
      models.historico_llamadas.belongsTo(models.grupo_seguimiento,{
        as: 'Seguimiento',foreignKey:'id_grupo_seguimiento'
      })
      models.historico_llamadas.belongsTo(models.tipo_seguimiento,{
        as: 'TipoSeguimiento',foreignKey:'id_tipo_seguimiento'
      })
      models.historico_llamadas.hasMany(models.historial_seguimiento,{
        as: 'Historial',foreignKey:'id_historico'
      })
    }
  }
  historico_llamadas.init({
    id_historico: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    id_grupo_seguimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor seleciona el grupo de seguimiento.'
        }
      }
    },
    id_contacto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor seleciona el contacto.'
        }
      }
    },
    id_tipo_seguimiento: DataTypes.INTEGER,
    fecha_actualizacion: DataTypes.DATEONLY,
    prox_llamada: DataTypes.DATE,
    estado: DataTypes.BOOLEAN,
    observacion_llamada: DataTypes.STRING(150)
  }, {
    sequelize,
    modelName: 'historico_llamadas',
    freezeTableName: true
  }); 
  return historico_llamadas;
};