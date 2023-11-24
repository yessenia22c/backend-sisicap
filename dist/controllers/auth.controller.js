"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authController = void 0;
var _models = _interopRequireWildcard(require("./../models"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = require("../config/config.js");
var _path = _interopRequireDefault(require("path"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
class AuthController {
  async login(req, res) {
    console.log(req.body);
    let user = await _models.usuario.findOne({
      where: {
        nombre_usuario: req.body.nombre_usuario,
        estado: true
      }
    });
    if (!user) {
      return res.json({
        mensaje: "Usuario Incorrecto"
      });
    } else {
      //verificando que la contraseña sea correcta
      let correcto = await _bcrypt.default.compare(req.body.contrasena_us, user.contrasena_us);
      if (correcto) {
        // Generamos el payload
        let payload = {
          //username: user.nombre_usuario,
          tus: user.id_tipo_usuario,
          //Cambio 12/03/2023 para agregar a angular el tipo usuario o su rol
          ius: user.id_usuario,
          //Para identificar que usuario se esta logueando
          time: new Date()
        };

        // generamos el token

        let token = _jsonwebtoken.default.sign(payload, _config.JWT_SECRET, {
          expiresIn: _config.JWT_EXPIRATION
        });
        res.status(200).send({
          id_user: user.id_usuario,
          access_token: token,
          error: false
        });

        /*res.status(200).send({
                    mensaje:"Auntentificado",
                    data:user,
                    error:false
                })*/
      } else {
        return res.status(200).json({
          mensaje: "Contrasena incorrecta",
          error: true
        });
      }
    }
  }
  async getPerfil(req, res) {
    try {
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
        }, {
          model: _models.default.empleado,
          attributes: ["id_empleado"],
          include: [{
            model: _models.default.persona,
            as: "PersonaEmpleado",
            attributes: ["nombres_per", "apellidos"]
          }]
        }]
      });
      if (Usuario) {
        // Enviar la respuesta al cliente
        res.status(200).json({
          status: 200,
          usuario: Usuario
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Usuario no registrado",
          error: false
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).send({
        mensaje: "No autorizado"
      });
    }
  }
  async subir_archivo(req, res) {
    try {
      const id_usuario = req.params.id_usuario;
      //verificamos si el usuario esta registrado
      const existe = await _models.usuario.findOne({
        where: {
          id_usuario: id_usuario
        }
      });
      if (existe) {
        //console.log(req.file)
        const nombreImagen = existe.nombre_usuario;
        const imageTempPath = req.file.path;
        const ext = _path.default.extname(req.file.originalname).toLowerCase(); // la extension en minuscula
        const des = req.file.destination; //la capeta destino
        const targetPath = _path.default.resolve(`${des}/uploadUser/${nombreImagen}${ext}`); // destino del archivo

        const targetSimplificado = `${process.env.HOST || "http://localhost"}:${process.env.PORT || 4000}/upload/uploadUser/${nombreImagen}${ext}`; //direccion para guardar en la basede datos

        if (ext === ".jpg" || ext === ".png") {
          await _fsExtra.default.rename(imageTempPath, targetPath);
          const con_usuarios = await _models.usuario.update({
            foto_perfil: targetSimplificado
          }, {
            where: {
              id_usuario: id_usuario
            }
          });
          res.status(200).json({
            status: 200,
            mensaje: "Imagen Guardada Exitosamente",
            error: false
          });
        } else {
          await _fsExtra.default.unlink(imageTempPath); //elimina el archivo
          res.status(200).json({
            status: 500,
            mensaje: "Verifique: Sólo se puede subir imagen .png o pdf",
            error: false
          });
        }
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el Registro: no existe el Usuario seleccionado",
          error: true
        });
      }
    } catch (error) {
      // if(error.type)
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
}
const authController = exports.authController = new AuthController();