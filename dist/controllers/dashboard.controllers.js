"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashboardController = void 0;
var _models = _interopRequireDefault(require("../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class DashboardController {
  async cantidadParticipantesPorCiudadaes(req, res) {
    try {
      const ciudadesParticipantes = await _models.default.ciudad.findAll({
        attributes: ["nombre_ciudad", [_models.default.sequelize.fn("COUNT", _models.default.sequelize.col("personas.Personas.id_persona")), "value"]],
        include: [{
          model: _models.default.persona,
          as: "personas",
          attributes: [],
          include: [{
            model: _models.default.participante,
            as: "Personas",
            attributes: [],
            where: {
              estado: true
            }
          }]
        }],
        group: ["ciudad.id_ciudad"]
      });
      //console.log(ciudadesParticipantes)
      const resultadoFinal = ciudadesParticipantes.map(ciudad => ({
        name: ciudad.nombre_ciudad,
        value: ciudad.dataValues.value
        // extra: {
        //   code: ciudad.nombre_ciudad, 
        // },
      }));

      res.status(200).json({
        status: 200,
        data: resultadoFinal
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async cantidadParticipantePorSexo(req, res) {
    try {
      const sexoParticipantes = await _models.default.sexo.findAll({
        attributes: ["nombre_sexo", [_models.default.sequelize.fn("COUNT", _models.default.sequelize.col("personas.Personas.id_persona")), "value"]],
        include: [{
          model: _models.default.persona,
          as: "personas",
          attributes: [],
          include: [{
            model: _models.default.participante,
            as: "Personas",
            attributes: [],
            where: {
              estado: true
            }
          }]
        }],
        group: ["sexo.id_sexo"]
      });
      //console.log(sexoParticipantes)
      const resultadoFinal = sexoParticipantes.map(sexo => ({
        name: sexo.nombre_sexo,
        value: sexo.dataValues.value
        // extra: {
        //   code: ciudad.nombre_ciudad, 
        // },
      }));

      res.status(200).json({
        status: 200,
        data: resultadoFinal
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
}
const dashboardController = exports.dashboardController = new DashboardController();