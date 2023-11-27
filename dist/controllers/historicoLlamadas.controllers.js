"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historicoController = void 0;
var _models = _interopRequireDefault(require("../models"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class HistoricoController {
  async registrarCambiosLlamada(req, res) {
    try {
      //console.log(req.body)
      const Cambios = await _models.default.historial_seguimiento.create({
        id_historico: req.body.id_historico,
        observacion_llamada: req.body.observacion_llamada,
        fecha_seguimiento: req.body.fecha_seguimiento
      });
      res.status(200).json({
        status: 200,
        mensaje: "Cambios registrados",
        error: false
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message
      });
    }
  }
  async verCambiosLlamada(req, res) {
    try {
      //console.log(req.body)

      let CambiosLLamada = await _models.default.historial_seguimiento.findAll({
        attributes: ["id_historico", "observacion_llamada", "fecha_seguimiento"],
        where: {
          id_historico: req.params.id_historico
        }
      });
      if (CambiosLLamada && CambiosLLamada.length > 0) {
        res.status(200).json({
          status: 200,
          CambiosRegistrados: CambiosLLamada
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No hay cambios registrados",
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
  async registrar_contactos(req, res) {
    try {
      const {
        id_grupo_seguimiento,
        listaContactos
      } = req.body;
      for (const contacto of listaContactos) {
        const existeContacto = await _models.default.contacto.findOne({
          where: {
            numero_contacto: contacto.numero_contacto
          }
        });
        if (existeContacto) {
          // Si existe el contacto se registra en la tabla historico
          //verificar si ya se ha agregado al grupo de seguimiento
          const existeHistorico = await _models.default.historico_llamadas.findOne({
            where: {
              id_contacto: existeContacto.id_contacto,
              id_grupo_seguimiento: id_grupo_seguimiento
            }
          });
          if (existeHistorico) {
            //Si ya existe el contacto en el grupo de seguimiento se salta a la siguiente iteracion
            continue;
            // await models.historico_llamadas.update({
            //     estado: true,
            // },{
            //     where: {id_contacto: existeContacto.id_contacto, id_grupo_seguimiento: id_grupo_seguimiento}
            // });
          } else {
            //Si no existe el contacto en el grupo de seguimiento se agrega
            const historico = await _models.default.historico_llamadas.create({
              id_grupo_seguimiento: id_grupo_seguimiento,
              id_contacto: existeContacto.id_contacto
            });
          }
        } else {
          //Si no existe el contacto se crea en la tabla contacto luego se agrega al grupo de seguimiento
          const nuevoContacto = await _models.default.contacto.create({
            nombre_apellidos: contacto.nombre_apellidos,
            numero_contacto: contacto.numero_contacto,
            correo_contacto: contacto.correo_contacto,
            estado: true
          });
          const historico = await _models.default.historico_llamadas.create({
            id_grupo_seguimiento: id_grupo_seguimiento,
            id_contacto: nuevoContacto.id_contacto
          });
        }
      }
      res.status(200).json({
        status: 200,
        mensaje: "Contactos registrados correctamente al grupo de seguimiento"
      });
    } catch (error) {
      res.status(422).json({
        status: 422,
        mensaje: "Error al registrar los contactos al grupo de seguimiento"
      });
    }
  }
  async verSeguimientoContacto(req, res) {
    try {
      let listaSeguimiento = await _models.default.historico_llamadas.findAll({
        attributes: ["id_historico", "id_grupo_seguimiento", "fecha_actualizacion", "prox_llamada", "observacion_llamada"],
        where: {
          id_grupo_seguimiento: req.params.id_grupo_seguimiento,
          estado: true
        },
        include: [{
          model: _models.default.contacto,
          as: "Contactos",
          attributes: ["id_contacto", "nombre_apellidos", "numero_contacto", "correo_contacto", "nombre_empresa", "profesion", "intereses", "observaciones"],
          where: {
            estado: true
          },
          include: [{
            model: _models.default.sexo,
            as: "Sexo_contacto",
            attributes: ["id_sexo", "nombre_sexo"]
          }, {
            model: _models.default.ciudad,
            as: "Ciudad_contacto",
            attributes: ["id_ciudad", "nombre_ciudad"]
          }, {
            model: _models.default.pais,
            as: "Pais_contacto",
            attributes: ["id_pais", "nombre_pais"]
          }, {
            model: _models.default.estado_contacto,
            as: "Estado",
            attributes: ["id_estado_contacto", "nombre_estado"]
          }]
        }, {
          model: _models.default.tipo_seguimiento,
          as: "TipoSeguimiento",
          attributes: ["id_tipo_seguimiento", "nombre_tipo_seguimiento"]
        }]
      });
      res.status(200).json({
        status: 200,
        AllContactosSeguimiento: listaSeguimiento
      });
    } catch (error) {
      res.status(422).json({
        status: 422,
        mensaje: "no hay contactos en el grupo de seguimiento"
      });
    }
  }
  async actualizarSeguimientoContacto(req, res) {
    const dataToUpdate = req.body.InformacionContacto;
    try {
      const existeContacto = await _models.default.contacto.findOne({
        where: {
          numero_contacto: dataToUpdate.Contactos.numero_contacto
        }
      });
      const existeHistorico = await _models.default.historico_llamadas.findOne({
        where: {
          id_historico: dataToUpdate.id_historico
        }
      });

      // const existeTipoSeguimiento = await models.tipo_seguimiento.findOne({
      //   where: { id_tipo_seguimiento: dataToUpdate.TipoSeguimiento.id_tipo_seguimiento },
      // });
      if (existeContacto && existeHistorico) {
        const contacto = await _models.default.contacto.update({
          nombre_apellidos: dataToUpdate.Contactos.nombre_apellidos,
          numero_contacto: dataToUpdate.Contactos.numero_contacto,
          correo_contacto: dataToUpdate.Contactos.correo_contacto,
          nombre_empresa: dataToUpdate.Contactos.nombre_empresa,
          profesion: dataToUpdate.Contactos.profesion,
          intereses: dataToUpdate.Contactos.intereses,
          observaciones: dataToUpdate.Contactos.observaciones,
          id_sexo: dataToUpdate.Contactos.Sexo_contacto.id_sexo,
          id_ciudad: dataToUpdate.Contactos.Ciudad_contacto.id_ciudad,
          id_pais: dataToUpdate.Contactos.Pais_contacto.id_pais,
          id_estado_contacto: dataToUpdate.Contactos.Estado.id_estado_contacto
        }, {
          where: {
            id_contacto: dataToUpdate.Contactos.id_contacto,
            estado: true
          }
        });
        //Solucionar hay un error en el formatear la fecga actualizacion
        const historico = await _models.default.historico_llamadas.update({
          id_grupo_seguimiento: dataToUpdate.id_grupo_seguimiento,
          fecha_actualizacion: dataToUpdate.fecha_actualizacion,
          prox_llamada: dataToUpdate.prox_llamada,
          id_tipo_seguimiento: dataToUpdate.TipoSeguimiento.id_tipo_seguimiento,
          observacion_llamada: dataToUpdate.observacion_llamada
        }, {
          where: {
            id_historico: dataToUpdate.id_historico,
            id_contacto: dataToUpdate.Contactos.id_contacto
          }
        });
        //console.log("existeCambios?", existeHistorico.dataValues.observacion_llamada)
        if (existeHistorico.dataValues.observacion_llamada != dataToUpdate.observacion_llamada) {
          //Error aqui  existeContacto.observacion_llamada esto es undefine y siempre guarda cambios
          //console.log("entro observacion llamada", existeHistorico.dataValues.observacion_llamada, 'VAlor nuevo ', dataToUpdate.observacion_llamada)
          //registrar cambios en historial_seguimiento
          const cambios = await _models.default.historial_seguimiento.create({
            id_historico: dataToUpdate.id_historico,
            observacion_llamada: dataToUpdate.observacion_llamada,
            fecha_seguimiento: _models.default.sequelize.literal('CURRENT_TIMESTAMP')
          });
        }
        let unContactoSeguimiento = await _models.default.historico_llamadas.findOne({
          attributes: ["id_historico", "id_grupo_seguimiento", "fecha_actualizacion", "prox_llamada", "observacion_llamada"],
          where: {
            id_grupo_seguimiento: dataToUpdate.id_grupo_seguimiento,
            estado: true
          },
          include: [{
            model: _models.default.contacto,
            as: "Contactos",
            attributes: ["id_contacto", "nombre_apellidos", "numero_contacto", "correo_contacto", "nombre_empresa", "profesion", "intereses", "observaciones"],
            where: {
              estado: true,
              id_contacto: dataToUpdate.Contactos.id_contacto
            },
            include: [{
              model: _models.default.sexo,
              as: "Sexo_contacto",
              attributes: ["id_sexo", "nombre_sexo"]
            }, {
              model: _models.default.ciudad,
              as: "Ciudad_contacto",
              attributes: ["id_ciudad", "nombre_ciudad"]
            }, {
              model: _models.default.pais,
              as: "Pais_contacto",
              attributes: ["id_pais", "nombre_pais"]
            }, {
              model: _models.default.estado_contacto,
              as: "Estado",
              attributes: ["id_estado_contacto", "nombre_estado"]
            }]
          }, {
            model: _models.default.tipo_seguimiento,
            as: "TipoSeguimiento",
            attributes: ["id_tipo_seguimiento", "nombre_tipo_seguimiento"]
          }]
        });
        res.status(200).json({
          informacionActualizadoContacto: unContactoSeguimiento,
          status: 200,
          mensaje: "Datos Actualizados Exitosamente",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar el registro: El contacto no existe",
          error: true
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: "Error al actualizar datos"
      });
    }
  }
  async asignarContactoEnSeguimiento(req, res) {
    try {
      let contactosSaltados = 0; // Inicializa el contador en 0
      let contactosRegistrados = 0; // Inicializa el contador en 0
      const {
        id_grupo_seguimiento,
        id_capacitacion,
        listaContactos
      } = req.body;
      for (const contacto of listaContactos) {
        const existeContacto = await _models.default.contacto.findOne({
          where: {
            id_contacto: contacto.id_contacto,
            estado: true
          }
        });
        if (existeContacto) {
          // Si existe el contacto se registra en la tabla historico
          //verificar si ya se ha agregado al grupo de seguimiento en de la capacitacion
          const existeHistorico = await _models.default.historico_llamadas.findOne({
            include: [{
              model: _models.default.grupo_seguimiento,
              as: "Seguimiento",
              where: {
                // id_grupo_seguimiento: id_grupo_seguimiento,
                id_capacitacion: id_capacitacion
              }
            }],
            where: {
              id_contacto: existeContacto.id_contacto
            }
          });
          if (existeHistorico) {
            //Si ya existe el contacto en el grupo de seguimiento en una capacitacion se salta a la siguiente iteracion
            // Mostrar un contador de cuantos contactos se han saltado

            contactosSaltados++;
            continue;
          } else {
            //Si no existe el contacto en el grupo de seguimiento se agrega
            const historico = await _models.default.historico_llamadas.create({
              id_grupo_seguimiento: id_grupo_seguimiento,
              id_contacto: existeContacto.id_contacto
            });
            contactosRegistrados++;
          }
        } else {
          //Si no existe el contacto mostrar el mensaje  de resouesta de error
          res.status(422).json({
            status: 422,
            mensaje: "El sistema no puede completar el registro: El contacto no existe",
            error: true
          });
        }
      }
      res.status(200).json({
        status: 200,
        mensaje: "Contactos registrados correctamente al grupo de seguimiento",
        nroContactosSaltados: contactosSaltados,
        nroContactosRegistrados: contactosRegistrados
      });
    } catch (error) {
      res.status(422).json({
        status: 422,
        mensaje: "Error al registrar los contactos al grupo de seguimiento"
      });
    }
  }
  async eliminarContactoEnSeguimiento(req, res) {
    try {
      //console.log(req.body)
      const existe = await _models.default.historico_llamadas.findOne({
        where: {
          id_historico: req.params.id_historico
        }
      });
      if (existe) {
        const Contacto = await _models.default.historico_llamadas.destroy({
          where: {
            id_historico: req.params.id_historico
          }
        });
        res.status(200).json({
          status: 200,
          mensaje: "Contacto Eliminado",
          error: false
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje: "El sistema no puede completar lo solicitado: El contacto no existe",
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
const historicoController = exports.historicoController = new HistoricoController();