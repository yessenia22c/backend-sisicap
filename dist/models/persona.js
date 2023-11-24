'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class persona extends Model {
    static associate(models) {
      models.persona.belongsTo(models.sexo, {
        foreignKey: 'id_sexo'
      });
      models.persona.belongsTo(models.ciudad, {
        foreignKey: 'id_ciudad'
      });
      models.persona.belongsTo(models.pais, {
        as: 'Pais',
        foreignKey: 'id_pais'
      });

      //Relaciones empleados, facilitador y participante
      models.persona.hasOne(models.empleado, {
        as: 'PersonaEmpleado',
        foreignKey: 'id_persona'
      });
      models.persona.hasOne(models.facilitador, {
        as: 'PersonaFacilitador',
        foreignKey: 'id_persona'
      });

      // Asociones con  ** REVISAR DESPUES
      models.persona.hasOne(models.participante, {
        as: 'Personas',
        foreignKey: 'id_persona'
      });
      // define association here
    }
  }

  persona.init({
    id_persona: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nombres_per: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre de la persona.'
        }
      }
    },
    apellidos: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el apellido.'
        }
      }
    },
    nro_ci: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Ingresa un numero de carnet de identificacion.'
        }
      }
    },
    id_sexo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Selecciona el sexo de la persona.'
        }
      }
    },
    correo: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      //{msg: 'Ya exite este correo'},
      validate: {
        isEmail: true,
        notNull: {
          msg: 'Ingresa un correo electrónico.'
        }
      }
    },
    telefono: DataTypes.STRING(50),
    id_ciudad: {
      type: DataTypes.INTEGER
    },
    fecha_nac: {
      type: DataTypes.DATEONLY

      // validate:{
      //   isAfter: "1920-01-01"

      // }
    },

    id_pais: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'persona',
    freezeTableName: true
  });
  return persona;
};