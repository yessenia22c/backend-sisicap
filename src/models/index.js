'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/../config/db.js')[env];

// nuevo añadido para despliegue de produccion de prueba
const {config} = require(__dirname + '/../config/db.js');
const db = {};

let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config, config.dialectOptions);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config, config.dialectOptions);
// }

// nuevo añadido para despliegue de produccion de prueba

const conexion = async () => {
  try {
    await sequelize.authenticate();
    console.log('CONEXIÓN EXITOSA A LA BASE DE DATOS.');
  } catch (error) {
    console.error('NO SE PUEDO CONECTAR A LA BASE DE DATOS:', error);
  }
}
if (config) {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect
  }, config.pool,
  
);
  conexion();
}else{
  console.log('config ERROR ',config);
}

// fin de nuevo añadido para despliegue de produccion de prueba

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
