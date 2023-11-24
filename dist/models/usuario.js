'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.usuario.belongsTo(models.empleado, {
        foreignKey: 'id_empleado'
      });
      models.usuario.belongsTo(models.tipo_usuario, {
        foreignKey: 'id_tipo_usuario'
      });
      models.usuario.hasMany(models.participante, {
        foreignKey: 'id_registrante'
      });
      // define association here
    }
  }

  usuario.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_usuario: {
      type: DataTypes.STRING(50),
      unique: true
    },
    contrasena_us: DataTypes.STRING(255),
    estado: DataTypes.BOOLEAN,
    foto_perfil: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "/upload/uploadUser/default.png"
    }
  }, {
    sequelize,
    modelName: 'usuario',
    freezeTableName: true
  });
  return usuario;
};