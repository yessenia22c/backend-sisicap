'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categoria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.categoria.hasMany(models.capacitacion,{
        as: 'Categoria',foreignKey:'id_categoria'
      })
    }
  }
  categoria.init({
    id_categoria: { 
      type:DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre_categoria: {
      type:DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Por favor ingresa el nombre de la categoría'
        }
      }
    },
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'categoria',
    freezeTableName: true
  });
  return categoria;
};