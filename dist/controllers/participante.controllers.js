"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.participanteController = void 0;
var _models = _interopRequireDefault(require("./../models"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _config = require("../config/config.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class ParticipanteController {
  async create_participante(req, res) {
    try {
      //console.log(req.body)

      const token = req.headers.authorization.split(" ")[1];

      // Verificar el token y extraer el ID del usuario
      const payload = _jsonwebtoken.default.verify(token, _config.JWT_SECRET);
      const usuarioRegistrante = payload.ius;
      const existe = await _models.default.participante.findOne({
        where: {
          id_persona: req.body.id_persona
        }
      });
      if (!existe) {
        const codigoRandom = Math.floor(Math.random() * 10); // Genera un número aleatorio del 0 al 9
        const codigoParticipante = `L` + Math.floor(Math.random() * 10000) + `-${codigoRandom}`; // Genera un número aleatorio de 0 a 9999
        // Verificar si el código ya existe en la tabla participantes
        let participanteExistente = await _models.default.participante.findOne({
          where: {
            codigo_participante: codigoParticipante
          }
        });
        // Mientras el código exista, generamos uno nuevo
        while (participanteExistente) {
          const codigoRandom = Math.floor(Math.random() * 10); // Genera un número aleatorio del 0 al 9
          const codigoParticipante = `L` + Math.floor(Math.random() * 10000) + `-${codigoRandom}`; // Genera un número aleatorio de 0 a 9999

          participanteExistente = await _models.default.participante.findOne({
            where: {
              codigo_participante: codigoParticipante
            }
          });
        }
        const unParticipante = await _models.default.participante.create({
          id_registrante: usuarioRegistrante,
          id_persona: req.body.id_persona,
          ocupacion: req.body.ocupacion,
          codigo_participante: codigoParticipante,
          estado: true
        });
        res.status(200).json({
          status: 200,
          mensaje: "Datos de participante registrados Exitosamente",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El participante ya esta registrado",
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
  async read_participante(req, res) {
    try {
      //console.log(req.body)

      let Participante = await _models.default.participante.findOne({
        attributes: ["id_participante", "id_registrante", "ocupacion", "codigo_participante"],
        where: {
          id_participante: req.params.id_participante,
          estado: true
        },
        include: [{
          model: _models.default.persona,
          as: "Personas",
          attributes: ["nombres_per", "apellidos", "nro_ci"]
        }]
      });
      if (Participante) {
        res.status(200).json({
          status: 200,
          usuario: Participante
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Participante no registrado",
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
  async personasNoParticipantes(req, res) {
    try {
      const personasNoParticipantes = await _models.default.persona.findAll({
        attributes: ['id_persona', 'nombres_per', 'apellidos', 'nro_ci'],
        where: {
          estado: true
        },
        include: [{
          model: _models.default.participante,
          as: 'Personas',
          attributes: ['id_participante', 'id_persona'],
          where: {
            estado: true
          },
          required: false
        }],
        having: {
          id_participante: null
        }
      });
      if (personasNoParticipantes) {
        res.status(200).json({
          status: 200,
          personasNoParticipantes: personasNoParticipantes
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen personas registradas",
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
  async readAll_participante(req, res) {
    try {
      //console.log(req.body)
      let Participante = await _models.default.participante.findAll({
        attributes: ["id_participante", "ocupacion", "codigo_participante"],
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
      });
      if (Participante) {
        res.status(200).json({
          status: 200,
          AllParticipantes: Participante
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen participantes registrados",
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
  async update_participante(req, res) {
    try {
      const {
        Personas
      } = req.body;

      // Crear una nueva persona con los datos proporcionados
      const actualizaPersona = await _models.default.persona.update({
        //id_persona : Personas.id_persona,
        nombres_per: Personas.nombres_per,
        apellidos: Personas.apellidos,
        nro_ci: Personas.nro_ci,
        id_sexo: Personas.id_sexo,
        correo: Personas.correo,
        telefono: Personas.telefono,
        id_ciudad: Personas.id_ciudad,
        fecha_nac: Personas.fecha_nac,
        id_pais: Personas.id_pais,
        estado: true
      }, {
        where: {
          id_persona: Personas.id_persona
        }
      });
      //console.log(req.body)
      const existe = await _models.default.participante.findOne({
        where: {
          id_participante: req.body.id_participante,
          estado: true
        }
      });
      if (existe) {
        const Participante = await _models.default.participante.update({
          id_participante: req.body.id_participante,
          //id_registrante: req.body.id_registrante,
          //id_persona: nuevaPersona.id_persona,
          ocupacion: req.body.ocupacion,
          //codigo_participante: req.body.codigo_participante,
          estado: true
        }, {
          where: {
            id_participante: req.body.id_participante
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Datos Actualizados Exitosamente",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El nombre del empleado no puede ser encontrado",
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
  async delete_participante(req, res) {
    try {
      //console.log(req.body)
      const existe = await _models.default.participante.findOne({
        where: {
          id_participante: req.params.id_participante
        }
      });
      if (existe) {
        const Participante = await _models.default.participante.update({
          estado: false
        }, {
          where: {
            id_participante: req.params.id_participante
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Participante Eliminado",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El participante no puede ser encontrado",
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
  async buscar_codigo(req, res) {
    try {
      //console.log(req.body)

      let Codigo = await _models.default.participante.findOne({
        attributes: ["id_participante", "id_registrante", "ocupacion", "codigo_participante"],
        where: {
          codigo_participante: req.params.codigo_participante,
          estado: true
        },
        include: [{
          model: _models.default.persona,
          as: "Personas",
          attributes: ["nombres_per", "apellidos", "nro_ci"]
        }]
      });
      if (Codigo) {
        res.status(200).json({
          status: 200,
          usuario: Codigo
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Participante no registrado",
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
  async create_participante_nuevo(req, res) {
    try {
      const {
        Personas
      } = req.body;

      //console.log(req.body)
      const token = req.headers.authorization.split(" ")[1];

      // Verificar el token y extraer el ID del usuario
      const payload = _jsonwebtoken.default.verify(token, _config.JWT_SECRET);
      const usuarioRegistrante = payload.ius;
      //const tipo_usuario = payload.tus;

      const existe = await _models.default.persona.findOne({
        where: {
          nro_ci: Personas.nro_ci,
          estado: true
        }
      });
      if (!existe) {
        const codigoRandom = Math.floor(Math.random() * 10); // Genera un número aleatorio del 0 al 9
        const codigoParticipante = `L` + Math.floor(Math.random() * 10000) + `-${codigoRandom}`; // Genera un número aleatorio de 0 a 9999

        // Verificar si el código ya existe en la tabla participantes
        let participanteExistente = await _models.default.participante.findOne({
          where: {
            codigo_participante: codigoParticipante
          }
        });

        // Mientras el código exista, generamos uno nuevo
        while (participanteExistente) {
          const codigoRandom = Math.floor(Math.random() * 10); // Genera un número aleatorio del 0 al 9
          const codigoParticipante = `L` + Math.floor(Math.random() * 10000) + `-${codigoRandom}`; // Genera un número aleatorio de 0 a 9999

          participanteExistente = await _models.default.participante.findOne({
            where: {
              codigo_participante: codigoParticipante
            }
          });
        }

        // Crear una nueva persona con los datos proporcionados
        const nuevaPersona = await _models.default.persona.create({
          nombres_per: Personas.nombres_per,
          apellidos: Personas.apellidos,
          nro_ci: Personas.nro_ci,
          id_sexo: Personas.id_sexo,
          correo: Personas.correo,
          telefono: Personas.telefono,
          id_ciudad: Personas.id_ciudad,
          fecha_nac: Personas.fecha_nac,
          id_pais: Personas.id_pais,
          estado: true
        });
        const nuevoParticipante = await _models.default.participante.create({
          id_participante: req.body.id_participante,
          // Se genera automáticamente
          id_registrante: usuarioRegistrante,
          id_persona: nuevaPersona.id_persona,
          ocupacion: req.body.ocupacion,
          codigo_participante: codigoParticipante,
          estado: true
        });
        res.status(200).json({
          status: 200,
          mensaje: "Datos Registrados Exitosamente",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: Hay una persona registrada con el mismo número de carnet",
          error: true
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error
      });
    }
  }
}
const participanteController = exports.participanteController = new ParticipanteController();