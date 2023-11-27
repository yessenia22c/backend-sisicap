import models from '../models'

class DashboardController {
    async cantidadParticipantesPorCiudadaes(req, res) {
        try {
            const ciudadesParticipantes = await models.ciudad.findAll({
                attributes: [
                    "nombre_ciudad",
                    [models.sequelize.fn("COUNT", models.sequelize.col("personas.Personas.id_persona")), "value"],
                ],
                include: [
                    {
                        model: models.persona,
                        as: "personas",
                        attributes: [],
                        include: [
                            {
                                model: models.participante,
                                as: "Personas",
                                attributes: [],
                                where:{estado: true}
                            },
                        ],
                    },
                ],
                group: ["ciudad.id_ciudad"],
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
                data: resultadoFinal,
            });
            
        } catch (error) {
            res.status(500).json({
                status: 500,
                mensaje: error.message,
            });
        }
    }
    async cantidadParticipantePorSexo(req, res) {
        try {
            const sexoParticipantes = await models.sexo.findAll({
                attributes: [
                    "nombre_sexo",
                    [models.sequelize.fn("COUNT", models.sequelize.col("personas.Personas.id_persona")), "value"],
                ],
                include: [
                    {
                        model: models.persona,
                        as: "personas",
                        attributes: [],
                        include: [
                            {
                                model: models.participante,
                                as: "Personas",
                                attributes: [],
                                where:{estado: true}
                            },
                        ],
                    },
                ],
                group: ["sexo.id_sexo"],
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
                data: resultadoFinal,
            });
            
        } catch (error) {
            res.status(500).json({
                status: 500,
                mensaje: error.message,
            });
        }
    
    }

}

export const dashboardController = new DashboardController()