import models from './../models'

class PersonaController {
  async create_persona(req, res) {
    try {
      //console.log(req.body)
      const existe = await models.persona.findOne({
        where: { nro_ci: req.body.nro_ci },
      });
      if (!existe) {
        const Persona = await models.persona.create({
          //id_persona: req.body.id_persona,
          nombres_per: req.body.nombres_per,
          apellidos: req.body.apellidos,
          nro_ci: req.body.nro_ci,
          id_sexo: req.body.id_sexo,
          correo: req.body.correo,
          telefono: req.body.telefono,
          id_ciudad: req.body.id_ciudad,
          fecha_nac: req.body.fecha_nac,
          id_pais: req.body.id_pais,
          estado: true,
        });

        res.status(200).json({
          status: 200,
          mensaje: "Datos Registrados Exitosamente",
          error: false,
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar el registro: El nombre de usuario ya esta siendo utilizado",
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
  async read_persona(req, res) {
    try {
      //console.log(req.body)

      let Persona = await models.persona.findOne({
        attributes: [
          "id_persona",
          "nombres_per",
          "apellidos",
          "nro_ci",
          "correo",
          "telefono",
          "fecha_nac",
        ],

        where: { id_persona: req.params.id_persona, estado: true },
        include: [
          {
            model: models.sexo,
            attributes: ["nombre_sexo"],
          },
          {
            model: models.ciudad,
            attributes: ["nombre_ciudad"],
          },
          {
            model: models.pais,
            as: "Pais",
            attributes: ["nombre_pais"],
          },
        ],
      });
      if (Persona) {
        res.status(200).json({
          status: 200,
          UnaPersona: Persona,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "Usuario no registrado",
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
  async readAll_persona(req, res) {
    try {
      //console.log(req.body)

      let Persona = await models.persona.findAll({
        attributes: [
          "id_persona",
          "nombres_per",
          "apellidos",
          "nro_ci",
          "correo",
          "telefono",
          "fecha_nac",
        ],

        where: { estado: true },
        include: [
          {
            model: models.sexo,
            attributes: ["id_sexo", "nombre_sexo"],
          },
          {
            model: models.ciudad,
            attributes: ["id_ciudad", "nombre_ciudad"],
          },
          {
            model: models.pais,
            as: "Pais",
            attributes: ["id_pais", "nombre_pais"],
          },
        ],
      });

      if (Persona) {
        res.status(200).json({
          status: 200,
          AllPersonas: Persona,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen usuario registrados",
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
  async update_persona(req, res) {
    try {
      //console.log(req.body)
      const existe = await models.persona.findOne({
        where: { id_persona: req.body.id_persona, estado: true },
      });
      if (existe) {
        const Persona = await models.persona.update(
          {
            id_persona: req.body.id_persona,
            nombres_per: req.body.nombres_per,
            apellidos: req.body.apellidos,
            nro_ci: req.body.nro_ci,
            id_sexo: req.body.id_sexo,
            correo: req.body.correo,
            telefono: req.body.telefono,
            id_ciudad: req.body.id_ciudad,
            fecha_nac: req.body.fecha_nac,
            id_pais: req.body.id_pais,
            estado: true,
          },
          {
            where: { id_persona: req.body.id_persona },
          }
        );

        res.status(200).json({
          status: 200,
          mensaje: "Datos Actualizados Exitosamente",
          error: false,
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar el registro: El nombre de usuario no puede ser encontrado",
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
  async delete_persona(req, res) {
    try {
      //console.log(req.body)
      const existe = await models.persona.findOne({
        where: { id_persona: req.params.id_persona },
      });
      if (existe) {
        const Persona = await models.persona.update(
          {
            estado: false,
          },
          {
            where: { id_persona: req.params.id_persona },
          }
        );

        res.status(200).json({
          status: 200,
          mensaje: "Usuario Eliminado",
          error: false,
        });
      } else {
        res.status(422).json({
          status: 422,
          mensaje:
            "El sistema no puede completar el registro: El nombre de usuario no puede ser encontrado",
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
  async readAll_Pais(req, res) {
    try {
      //console.log(req.body)

      let Pais = await models.pais.findAll({
        attributes: ["id_pais", "nombre_pais"]
      });

      if (Pais) {
        res.status(200).json({
          status: 200,
          AllPais: Pais,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen paises registrados",
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
  async readAll_Ciudad(req, res) {
    try {
      //console.log(req.body)

      let Ciudad = await models.ciudad.findAll({
        attributes: ["id_ciudad", "nombre_ciudad"]
      });

      if (Ciudad) {
        res.status(200).json({
          status: 200,
          AllCiudad: Ciudad,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen Ciudad registradas",
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
  async readAll_Sexo(req, res) {
    try {
      //console.log(req.body)

      let Sexo = await models.sexo.findAll({
        attributes: ["id_sexo", "nombre_sexo"]
      });

      if (Sexo) {
        res.status(200).json({
          status: 200,
          AllSexo: Sexo,
        });
      } else {
        res.status(200).json({
          status: 200,
          mensaje: "No existen Sexos registrados",
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
} 
//export const userController= new UserController
export const personaController= new PersonaController
