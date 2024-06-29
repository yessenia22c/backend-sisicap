"use strict";

var _express = _interopRequireDefault(require("express"));
var _router = require("./router");
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/// 1 importar modulos terceros
require('dotenv').config();
// import dotenv from 'dotenv'
// dotenv.config()
//const express = require ("express");
// 5 nueva alternativa para rutas
// 2. declarar variables auxiliares
const puerto = process.env.PORT ?? 4000;

// 3. inicializando express

let app = (0, _express.default)();

//8. habilitar cors
const listaBlanca = ['http://localhost:4200', 'https://ff80ca5a.cliente-angular-9k9.pages.dev', 'https://cliente-angular-9k9.pages.dev', process.env.FRONTEND_URL];
app.use((0, _cors.default)({
  origin: listaBlanca
}));

//9. carga de archivos estaticos
app.use(_express.default.static('public'));

//7. habilitar json en body
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));

// 6 habilitar rutas
app.use('/api/v1', _router.Route);

// 4. levantar el servidor express
app.listen(puerto, () => {
  console.log(`servidor levantado en el puerto ${puerto}`);
});