import models from '../models'

class ContactoController {
  async create_contacto(req, res) {
    try {
      //console.log(req.body)
      const existe = await models.contacto.findOne({
        where: { numero_contacto: req.body.numero_contacto },
      });
      if (!existe) {

        const Contacto = await models.contacto.create({
          //id_persona: req.body.id_persona,
          nombre_apellidos: req.body.nombre_apellidos,
          numero_contacto: req.body.numero_contacto,
          id_estado_contacto: req.body.id_estado_contacto,
          correo_contacto: req.body.correo_contacto,
          nombre_empresa: req.body.nombre_empresa,
          id_sexo: req.body.id_sexo,
          id_ciudad: req.body.id_ciudad,
          id_pais: req.body.id_pais,
          profesion: req.body.profesion,
          intereses: req.body.intereses,
          observaciones: req.body.observaciones,
          estado: true,
        });
        let nuevoContacto = await models.contacto.findOne({
          attributes: [
            "id_contacto",
            "nombre_apellidos",
            "numero_contacto",
            "correo_contacto",
            "nombre_empresa",
            "profesion",
            "intereses",
            "observaciones",
          ],
  
          where: { id_contacto: Contacto.id_contacto, estado: true },
          include: [
            {
              model: models.sexo,
              as: "Sexo_contacto",
              attributes: ["id_sexo","nombre_sexo"],
            },
            {
              model: models.ciudad,
              as: "Ciudad_contacto",
              attributes: ["id_ciudad","nombre_ciudad"],
            },
            {
              model: models.pais,
              as: "Pais_contacto",
              attributes: ["id_pais","nombre_pais"],
            },
            {
              model: models.estado_contacto,
              as: "Estado",
              attributes: ["id_estado_contacto", "nombre_estado"],
            },
          ],
        });


        res.status(200).json({
          datosContacto: nuevoContacto,
          status: 200,
          mensaje: "Datos Registrados Exitosamente",
          error: false,
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar el registro: el numero de contacto ya existe",
          error: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async read_contacto(req, res) {
    try {
      //console.log(req.body)

      let Contacto = await models.contacto.findOne({
        attributes: [
          "id_contacto",
          "nombre_apellidos",
          "numero_contacto",
          "correo_contacto",
          "nombre_empresa",
          "profesion",
          "intereses",
          "observaciones",
        ],

        where: { id_contacto: req.params.id_contacto, estado: true },
        include: [
          {
            model: models.sexo,
            as: "Sexo_contacto",
            attributes: ["id_sexo","nombre_sexo"],
          },
          {
            model: models.ciudad,
            as: "Ciudad_contacto",
            attributes: ["id_ciudad","nombre_ciudad"],
          },
          {
            model: models.pais,
            as: "Pais_contacto",
            attributes: ["id_pais","nombre_pais"],
          },
          {
            model: models.estado_contacto,
            as: "Estado",
            attributes: ["id_estado_contacto", "nombre_estado"],
          },
        ],
      });
      if (Contacto) {
        res.status(200).json({
          status: 200,
          UnContacto: Contacto,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Contacto no registrado",
          error: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async readAll_contacto(req, res) {
    try {
      //console.log(req.body)

      let Contacto = await models.contacto.findAll({
        attributes: [
          "id_contacto",
          "nombre_apellidos",
          "numero_contacto",
          "correo_contacto",
          "nombre_empresa",
          "profesion",
          "intereses",
          "observaciones",
        ],

        where: { estado: true },
        include: [
          {
            model: models.sexo,
            as: "Sexo_contacto",
            attributes: ["id_sexo", "nombre_sexo"],
          },
          {
            model: models.ciudad,
            as: "Ciudad_contacto",
            attributes: ["id_ciudad", "nombre_ciudad"],
          },
          {
            model: models.pais,
            as: "Pais_contacto",
            attributes: ["id_pais", "nombre_pais"],
          },
          {
            model: models.estado_contacto,
            as: "Estado",
            attributes: ["id_estado_contacto","nombre_estado"],
          }
        ],
      });

      if (Contacto) {
        res.status(200).json({
          status: 200,
          AllContacto: Contacto,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen Contactos registrados",
          error: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async update_contacto(req, res) {
    try {
      //console.log(req.body)
        
      //console.log('DATOS que llegan',req.body)
      const existe = await models.contacto.findOne({
        where: { id_contacto: req.body.id_contacto, estado: true },
      });
      if (existe) {
        console.log('DATOS que llegan',req.body)
        const Contacto = await models.contacto.update(
          {
            id_contacto: req.body.id_contacto,
            nombre_apellidos: req.body.nombre_apellidos,
            numero_contacto: req.body.numero_contacto,
            id_estado_contacto: req.body.id_estado_contacto,
            correo_contacto: req.body.correo_contacto,
            nombre_empresa: req.body.nombre_empresa,
            id_sexo: req.body.id_sexo,
            id_ciudad: req.body.id_ciudad,
            id_pais: req.body.id_pais,
            profesion: req.body.profesion,
            intereses: req.body.intereses,
            observaciones: req.body.observaciones,
            estado: true,
          },
          {
            where: { id_contacto: req.body.id_contacto, estado: true },
          }
        );
        console.log('DATOS ID CONTACTO', Contacto)
        let contactoActualizado = await models.contacto.findOne({
          attributes: [
            "id_contacto",
            "nombre_apellidos",
            "numero_contacto",
            "correo_contacto",
            "nombre_empresa",
            "profesion",
            "intereses",
            "observaciones",
          ],
  
          where: { id_contacto: req.body.id_contacto, estado: true },
          include: [
            {
              model: models.sexo,
              as: "Sexo_contacto",
              attributes: ["id_sexo","nombre_sexo"],
            },
            {
              model: models.ciudad,
              as: "Ciudad_contacto",
              attributes: ["id_ciudad","nombre_ciudad"],
            },
            {
              model: models.pais,
              as: "Pais_contacto",
              attributes: ["id_pais","nombre_pais"],
            },
            {
              model: models.estado_contacto,
              as: "Estado",
              attributes: ["id_estado_contacto", "nombre_estado"],
            },
          ],
        });

        res.status(200).json({
          datosContacto: contactoActualizado,
          status: 200,
          mensaje: "Datos Actualizados Exitosamente",
          error: false,
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar el registro: El contacto no existe",
          error: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async delete_contacto(req, res) {
    try {
      //console.log(req.body)
      const existe = await models.contacto.findOne({
        where: { id_contacto: req.params.id_contacto },
      });
      if (existe) {
        const Contacto = await models.contacto.update(
          {
            estado: false,
          },
          {
            where: { id_contacto: req.params.id_contacto },
          }
        );

        res.status(200).json({
          status: 200,
          mensaje: "Contacto Eliminado",
          error: false,
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar lo solicitado: El contacto no existe",
          error: true,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async readAll_tipoSeguimiento(req, res) {
    try {
      //console.log(req.body)

      let Tipo_seguimiento = await models.tipo_seguimiento.findAll({
        attributes: ["id_tipo_seguimiento", "nombre_tipo_seguimiento"],
      });

      if (Tipo_seguimiento) {
        res.status(200).json({
          status: 200,
          TipoSeguimientos: Tipo_seguimiento,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen Tipo de seguimiento registrados",
          error: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async readAll_estadoContacto(req, res) {
    try {
      //console.log(req.body)

      let Estado = await models.estado_contacto.findAll({
        attributes: ["id_estado_contacto", "nombre_estado"],
      });

      if (Estado) {
        res.status(200).json({
          status: 200,
          Estados: Estado,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen Estados registrados",
          error: false,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        mensaje: error.message,
      });
    }
  }
  async subirContactos(req, res) {
    try {
      let contactosSaltados = 0; // Inicializa el contador en 0
      let contactosRegistrados = 0; // Inicializa el contador en 0
      const { listaContactos } = req.body;
      for (const contacto of listaContactos) {
        const existeContacto = await models.contacto.findOne({
          where: { numero_contacto: contacto.numero_contacto, estado: true },
        });
        if (existeContacto) {
          // Si exite el contacto se lo salta y se pasa al siguiente
          contactosSaltados++;
          continue;
        } else {
          //Si no existe el contacto mostrar el mensaje  de resouesta de error

          //Si no existe el contacto en el grupo de seguimiento se agrega
          const historico = await models.contacto.create({
            nombre_apellidos: contacto.nombre_apellidos,
            numero_contacto: contacto.numero_contacto,
            correo_contacto: contacto.correo_contacto,
            nombre_empresa: contacto.nombre_empresa,
            profesion: contacto.profesion,
            intereses: contacto.intereses,
            observaciones: contacto.observaciones,
            estado: true
          });
          contactosRegistrados++;
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
        mensaje: "Error al registrar los contactos al grupo de seguimiento",
      });
    }
  }
  // async readAll_Pais(req, res) {
  //   try {
  //     //console.log(req.body)

  //     let Pais = await models.pais.findAll({
  //       attributes: ["id_pais", "nombre_pais"]
  //     });

  //     if (Pais) {
  //       res.status(200).json({
  //         status: 200,
  //         AllPais: Pais,
  //       });
  //     } else {
  //       res.status(200).json({
  //         status: 200,
  //         mensaje: "No existen paises registrados",
  //         error: false,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       status: 500,
  //       mensaje: error.message,
  //     });
  //   }
  // }
  // async readAll_Ciudad(req, res) {
  //   try {
  //     //console.log(req.body)

  //     let Ciudad = await models.ciudad.findAll({
  //       attributes: ["id_ciudad", "nombre_ciudad"]
  //     });

  //     if (Ciudad) {
  //       res.status(200).json({
  //         status: 200,
  //         AllCiudad: Ciudad,
  //       });
  //     } else {
  //       res.status(200).json({
  //         status: 200,
  //         mensaje: "No existen Ciudad registradas",
  //         error: false,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       status: 500,
  //       mensaje: error.message,
  //     });
  //   }
  // }
  // async readAll_Sexo(req, res) {
  //   try {
  //     //console.log(req.body)

  //     let Sexo = await models.sexo.findAll({
  //       attributes: ["id_sexo", "nombre_sexo"]
  //     });

  //     if (Sexo) {
  //       res.status(200).json({
  //         status: 200,
  //         AllSexo: Sexo,
  //       });
  //     } else {
  //       res.status(200).json({
  //         status: 200,
  //         mensaje: "No existen Sexos registrados",
  //         error: false,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       status: 500,
  //       mensaje: error.message,
  //     });
  //   }
  // }
} 
//export const userController= new UserController
export const contactoController = new ContactoController
