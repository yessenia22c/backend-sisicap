'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class capacitacion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.capacitacion.belongsTo(models.categoria, {
        as: 'Categoria',
        foreignKey: 'id_categoria'
      });

      //relacion muchos a mucho con participantes y
      models.capacitacion.hasMany(models.informe_inscripciones, {
        as: 'Capacitaciones',
        foreignKey: 'id_capacitacion'
      });
      models.capacitacion.hasMany(models.grupo_seguimiento, {
        as: 'Capacitacion',
        foreignKey: 'id_capacitacion'
      });
    }
  }
  capacitacion.init({
    id_capacitacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombre_capacitacion: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre de la capacitación.'
        }
      },
      unique: true
    },
    fecha_inicio_cap: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa la fecha de inicio.'
        }
      }
    },
    fecha_fin_cap: DataTypes.DATEONLY,
    cantidad_modulos: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "Solo se admite un numero entero positivo"
        }
      }
    },
    estado: DataTypes.BOOLEAN,
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor selecciona una categoría.'
        },
        isInt: true
      }
    },
    vigente: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'capacitacion',
    freezeTableName: true
  });
  return capacitacion;
};