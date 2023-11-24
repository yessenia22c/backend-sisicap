"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validacionController = void 0;
var _models = _interopRequireDefault(require("./../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ValidacionController {
  async validarNombreUsuario(req, res) {
    // const { nombreUsuario } = req.params
    const usuario = await _models.default.usuario.findOne({
      where: {
        nombre_usuario: req.params.nombre_usuario
      }
    });
    if (usuario) {
      res.json({
        dispobible: false
      });
    } else {
      res.json({
        disponible: true
      });
    }
  }
  async validarCarnetIdentidad(req, res) {
    const unaPersona = await _models.default.persona.findOne({
      where: {
        nro_ci: req.params.nro_ci
      }
    });
    if (unaPersona) {
      res.json({
        dispobible: false
      });
    } else {
      res.json({
        disponible: true
      });
    }
  }
  async validarCorreo(req, res) {
    const unaPersona = await _models.default.persona.findOne({
      where: {
        correo: req.params.correo
      }
    });
    if (unaPersona) {
      res.json({
        dispobible: false
      });
    } else {
      res.json({
        disponible: true
      });
    }
  }
  async validarNumeroContacto(req, res) {
    const unContacto = await _models.default.contacto.findOne({
      where: {
        numero_contacto: req.params.numero_contacto
      }
    });
    if (unContacto) {
      res.json({
        dispobible: false
      });
    } else {
      res.json({
        disponible: true
      });
    }
  }
}
const validacionController = exports.validacionController = new ValidacionController();