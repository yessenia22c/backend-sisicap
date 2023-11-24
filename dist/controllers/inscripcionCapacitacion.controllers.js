"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inscripcionCapacitacionController = void 0;
var _models = _interopRequireDefault(require("./../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const {
  Op
} = require("sequelize");
//import{informe_inscripciones} from './../models/informe_inscripciones.js'

class InscripcionCapacitacionController {
  async inscribir_capacitacion(req, res) {
    try {
      //console.log(req.body)
      //Verifico si ya existe la inscripcion
      let inscripcion = await _models.default.informe_inscripciones.findOne({
        where: {
          id_capacitacion: req.body.id_capacitacion,
          id_participante: req.body.id_participante
        } //realice el cambio de params a body para que funcione el postman
      });

      if (!inscripcion) {
        //Si no existe la inscripcion, la creo
        const Inscripcion = await _models.default.informe_inscripciones.create({
          id_participante: req.body.id_participante,
          id_capacitacion: req.body.id_capacitacion //Esto hay que cambiar, no es seguro que inserte desde la ruta
        });

        res.status(200).json({
          status: 200,
          mensaje: "Inscrito exitosamente",
          error: false
        });
      } else {
        //Si ya existe la inscripcion, muestro el mensaje
        res.status(422).json({
          status: 422,
          mensaje: "El participante ya está inscrito en esta capacitacion",
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
  async participantes_inscritos(req, res) {
    try {
      //console.log(req.body)

      let inscripcion = await _models.default.informe_inscripciones.findAll({
        attributes: ['id_inscripcion'],
        where: {
          id_capacitacion: req.params.id_capacitacion,
          //
          estado: true
        },
        include: [{
          model: _models.default.participante,
          as: "Participantes",
          attributes: ["id_participante", "codigo_participante", "ocupacion"],
          where: {
            estado: true
          },
          include: [{
            model: _models.default.persona,
            as: "Personas",
            attributes: ["id_persona", "nombres_per", "apellidos", "nro_ci", "correo", "telefono", "fecha_nac"],
            include: [{
              model: _models.default.ciudad,
              attributes: ["id_ciudad", "nombre_ciudad"]
            }, {
              model: _models.default.sexo,
              attributes: ["id_sexo", "nombre_sexo"]
            }, {
              model: _models.default.pais,
              as: "Pais",
              attributes: ["id_pais", "nombre_pais"]
            }]
          }, {
            model: _models.default.usuario,
            attributes: ["id_usuario", "nombre_usuario"]
          }]
        }]
      });
      const contar_ins = await _models.default.informe_inscripciones.count({
        attributes: [],
        where: {
          id_capacitacion: req.params.id_capacitacion,
          estado: true
        }
      });
      if (contar_ins >= 1) {
        res.status(200).json({
          status: 200,
          inscritos: inscripcion
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay inscritos",
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
  //Analisar insertar en la tabla informe_inscripciones array de participantes
  async inscribirListaParticipantes(req, res) {
    try {
      // Array de inscripciones
      const inscripciones = req.body.inscripciones;

      // Validar si el array está vacío
      if (inscripciones.length === 0) {
        return res.status(400).json({
          status: 400,
          mensaje: "El array de inscripciones está vacío",
          error: true
        });
      }

      // Verificar si hay inscripciones duplicadas
      const inscripcionesDuplicadas = [];
      // Recorrer el array de inscripciones y verificar si ya existe alguna inscripción duplicada
      for (const inscripcion of inscripciones) {
        const existente = await _models.default.informe_inscripciones.findOne({
          where: {
            id_capacitacion: inscripcion.id_capacitacion,
            id_participante: inscripcion.id_participante
          }
        });
        if (existente) {
          inscripcionesDuplicadas.push(inscripcion);
        }
      }

      // Si hay inscripciones duplicadas, mostrar mensaje de error
      if (inscripcionesDuplicadas.length > 0) {
        return res.status(422).json({
          status: 422,
          mensaje: "Algunos participantes ya están inscritos en esta capacitación y se ha cancelado la inscripción de los demás",
          total_duplicados: inscripcionesDuplicadas.length,
          error: true
        });
      }

      // Crear todas las inscripciones si no hay duplicados
      for (const inscripcion of inscripciones) {
        await _models.default.informe_inscripciones.create({
          id_participante: inscripcion.id_participante,
          id_capacitacion: inscripcion.id_capacitacion
        });
      }
      // Si todo sale bien, mostrar mensaje de éxito
      res.status(200).json({
        status: 200,
        mensaje: "Inscripciones exitosas",
        error: false
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
        error: true
      });
    }
  }
  async getParticipantesNoInscritos(req, res) {
    try {
      //console.log(req.body)
      const participantesInscritos = await _models.default.informe_inscripciones.findAll({
        attributes: ["id_participante"],
        where: {
          id_capacitacion: req.params.id_capacitacion
        }
      });
      let participantesNoInscritos = await _models.default.participante.findAll({
        attributes: ["id_participante"],
        where: {
          estado: true,
          id_participante: {
            [_models.default.Sequelize.Op.notIn]: participantesInscritos.map(participante => participante.id_participante)
          }
        },
        include: [{
          model: _models.default.persona,
          as: "Personas",
          attributes: ["nombres_per", "apellidos"]
        }],
        order: [["id_participante", "ASC"]]
      });
      if (participantesNoInscritos.length >= 1) {
        res.status(200).json({
          status: 200,
          participantes: participantesNoInscritos
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay participantes disponibles",
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
  async eliminarUnParticipanteInscrito(req, res) {
    try {
      //console.log(req.body)
      const existe = await _models.default.informe_inscripciones.findOne({
        where: {
          id_inscripcion: req.params.id_inscripcion
        }
      });
      if (existe) {
        const eliminar = await _models.default.informe_inscripciones.destroy({
          where: {
            id_inscripcion: req.params.id_inscripcion
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Participante eliminado de la capacitacion",
          error: false
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No se pudo eliminar el participante",
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
}
const inscripcionCapacitacionController = exports.inscripcionCapacitacionController = new InscripcionCapacitacionController();