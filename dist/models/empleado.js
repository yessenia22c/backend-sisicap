'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class empleado extends Model {
    static associate(models) {
      models.empleado.belongsTo(models.cargo, {
        foreignKey: 'id_cargo'
      });
      models.empleado.belongsTo(models.persona, {
        as: 'PersonaEmpleado',
        foreignKey: 'id_persona'
      });
      models.empleado.belongsTo(models.empresa_empleadora, {
        foreignKey: 'id_empresa_empleadora'
      });
      models.empleado.belongsTo(models.usuario, {
        foreignKey: 'id_empleado'
      });
      models.empleado.hasMany(models.grupo_seguimiento, {
        as: 'Empleado',
        foreignKey: 'id_empleado'
      });
      // define association here
    }
  }

  empleado.init({
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor agrega el dato de la persona.'
        }
      }
    },
    id_cargo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor selecciona un cargo.'
        }
      }
    },
    fecha_contrato: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa la fecha de contrato.'
        }
      }
    },
    id_empresa_empleadora: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor selecciona la empresa.'
        }
      }
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'empleado',
    freezeTableName: true
  });
  return empleado;
};