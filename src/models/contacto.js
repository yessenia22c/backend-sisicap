'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contacto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.contacto.hasMany(models.historico_llamadas,{
        as: 'Contactos',foreignKey:'id_contacto'
      })
      models.contacto.belongsTo(models.estado_contacto,{
        as: 'Estado',foreignKey:'id_estado_contacto'
      })
      models.contacto.belongsTo(models.sexo,{
        as: 'Sexo_contacto',foreignKey:'id_sexo'
      })
      models.contacto.belongsTo(models.ciudad,{
        as:'Ciudad_contacto', foreignKey:'id_ciudad'
      })
      models.contacto.belongsTo(models.pais,{
        as: 'Pais_contacto', foreignKey:'id_pais'
      })
    }
  }
  contacto.init({
    id_contacto: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_apellidos: {
      type:DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre de la persona.'
        }
      }
    },
    numero_contacto: {
      type:DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el numero de contacto.'
        }
      },
      unique: true
    },
    id_estado_contacto: {
      type: DataTypes.INTEGER
    },
    correo_contacto: DataTypes.STRING(100),
    nombre_empresa: DataTypes.STRING(90),
    id_sexo: DataTypes.INTEGER,
    id_ciudad: DataTypes.INTEGER,
    id_pais: DataTypes.INTEGER,
    profesion: DataTypes.STRING(80),
    intereses: DataTypes.STRING(100),
    observaciones: DataTypes.STRING(150),
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'contacto',
    freezeTableName: true
  });
  return contacto;
};