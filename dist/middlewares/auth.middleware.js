"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verificarNivelPermiso = exports.auth = void 0;
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = require("../config/config.js");
var _models = _interopRequireDefault(require("./../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// creamos una funcion anónima, el middleware recibe 
//3 parámetros req, res, next (si todo esta bien deja pasar a la siguiente ejecucion)
const auth = function (req, res, next) {
  let token = null;
  if (req.headers.authorization) {
    //sabemos que el req llega en este formato
    // Bearer  abc.xyz.xxx
    //token = req.headers.authorization.split("")[1];      
    token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token.split(" ")[1];
  }
  if (!token) {
    res.status(403).send({
      auth: false,
      mensaje: "No se proporciono el token de seguridad"
    });
  }
  _jsonwebtoken.default.verify(token, _config.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({
        auth: false,
        mensaje: "Error de autenticacion"
      });
    }
    next();
  });
};
exports.auth = auth;
const verificarNivelPermiso = nivelRequerido => {
  return async (req, res, next) => {
    // Obtener el token de la solicitud
    const token = req.headers.authorization.split(" ")[1];

    // Verificar el token y extraer el ID del usuario
    const payload = _jsonwebtoken.default.verify(token, _config.JWT_SECRET);
    const id_usuario = payload.ius;

    // Obtener el perfil del usuario
    let Usuario = await _models.default.usuario.findOne({
      attributes: ["nombre_usuario", "foto_perfil"],
      where: {
        id_usuario: id_usuario,
        estado: true
      },
      include: [{
        model: _models.default.tipo_usuario,
        attributes: ["id_tipo_usuario", "nombre_tipo_usuario"],
        include: [{
          model: _models.default.acceso,
          attributes: ["id_acceso", "id_nivel"],
          as: "TipoUsuarioAcceso",
          include: [{
            model: _models.default.nivel,
            as: "NivelAcceso",
            attributes: ["id_nivel", "nombre_nivel"]
          }]
        }]
      }
      // {
      //   model: models.empleado,
      //   attributes: ["id_empleado"],
      //   include: [
      //     {
      //       model: models.persona,
      //       attributes: ["nombres_per", "apellidos"],
      //     },
      //   ],
      // },
      ]
    });

    if (Usuario && Usuario.tipo_usuario.TipoUsuarioAcceso) {
      const tieneAcceso = Usuario.tipo_usuario.TipoUsuarioAcceso.some(acceso => {
        return acceso.id_nivel === nivelRequerido;
      });
      if (tieneAcceso) {
        // El usuario tiene el nivel de permiso requerido
        next(); // Continuar con la siguiente función de middleware (controlador de ruta)
      } else {
        return res.status(403).json({
          mensaje: "No permiso para esto - No autorizado"
        });
      }

      //next(); 
    } else {
      // El usuario no tiene el nivel de permiso requerido
      return res.status(403).json({
        mensaje: "No hay roles definidos"
      });
    }
  };
};
exports.verificarNivelPermiso = verificarNivelPermiso;