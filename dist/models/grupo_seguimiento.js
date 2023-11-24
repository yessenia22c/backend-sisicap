'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class grupo_seguimiento extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.grupo_seguimiento.hasMany(models.historico_llamadas, {
        as: 'Seguimiento',
        foreignKey: 'id_grupo_seguimiento'
      });
      models.grupo_seguimiento.belongsTo(models.capacitacion, {
        as: 'Capacitacion',
        foreignKey: 'id_capacitacion'
      });
      models.grupo_seguimiento.belongsTo(models.empleado, {
        as: 'Empleado',
        foreignKey: 'id_empleado'
      });
    }
  }
  grupo_seguimiento.init({
    id_grupo_seguimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_seguimiento: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre del seguimiento.'
        }
      }
    },
    fecha_creado: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa la fecha de creación del seguimiento.'
        }
      }
    },
    id_capacitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Selecciona la capacitación a la que pertenece el seguimiento.'
        }
      }
    },
    estado: DataTypes.BOOLEAN,
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Selecciona el empleado que hara el seguimiento.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'grupo_seguimiento',
    freezeTableName: true
  });
  return grupo_seguimiento;
};