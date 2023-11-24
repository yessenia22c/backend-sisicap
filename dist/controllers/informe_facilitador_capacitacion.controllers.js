"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.facilitadorCapacitacionController = void 0;
var _models = _interopRequireDefault(require("./../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  Op
} = require("sequelize");
class FacilitadorCapacitacionController {
  async asignar_facilitador_capacitacion(req, res) {
    try {
      //console.log(req.body)

      let registrar = await _models.default.informe_facilitador_capacitacion.findOne({
        where: {
          id_capacitacion: req.params.id_capacitacion,
          id_facilitador: req.body.id_facilitador
        }
      });
      if (!registrar) {
        const registrar_fac = await _models.default.informe_facilitador_capacitacion.create({
          id_facilitador: req.body.id_facilitador,
          id_capacitacion: req.params.id_capacitacion
        });
        res.status(200).json({
          status: 200,
          mensaje: "Facilitador asignado exitosamente",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El facilitador ya esta asignado a esta capacitacion",
          error: true
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async facilitador_asigado(req, res) {
    try {
      //console.log(req.body)

      let reporte = await _models.default.informe_facilitador_capacitacion.findAll({
        attributes: [],
        where: {
          'id_capacitacion': req.params.id_capacitacion,
          estado: true
        },
        include: [{
          model: _models.default.facilitador,
          as: 'Facilitadores',
          attributes: ['profesion'],
          include: [{
            model: _models.default.persona,
            as: 'PersonaFacilitador',
            attributes: ['nombres_per', 'apellidos', 'nro_ci']
          }]
        }]
      });
      const contar_fac = await _models.default.informe_facilitador_capacitacion.count({
        attributes: [],
        where: {
          'id_capacitacion': req.params.id_capacitacion,
          estado: true
        }
      });
      if (contar_fac >= 1) {
        res.status(200).json({
          status: 200,
          facilitador_asig: reporte
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay facilitador asignado",
          error: false
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async facilitadorCapacitaciones_readAll(req, res) {
    try {
      //console.log(req.body)

      let reporteCap = await _models.default.informe_facilitador_capacitacion.findAll({
        attributes: [],
        where: {
          //'id_capacitacion': req.params.id_capacitacion, 
          estado: true
        },
        include: [{
          model: _models.default.facilitador,
          as: 'Facilitadores',
          attributes: ['id_facilitador'],
          include: [{
            model: _models.default.persona,
            as: 'PersonaFacilitador',
            attributes: ['nombres_per', 'apellidos', 'nro_ci']
          }]
        }, {
          model: _models.default.capacitacion,
          as: 'Capacitacion_dada',
          attributes: ['nombre_capacitacion', 'fecha_inicio_cap', 'fecha_fin_cap']
        }]
      });
      if (reporteCap) {
        res.status(200).json({
          status: 200,
          facilitador_asig: reporteCap
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay facilitadores registrados",
          error: false
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
}
const facilitadorCapacitacionController = exports.facilitadorCapacitacionController = new FacilitadorCapacitacionController();