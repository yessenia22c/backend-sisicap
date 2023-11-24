import models from './../models'


class FacilitadorController{
    async  create_facilitador(req,res){
        try {
                //console.log(req.body)
                const existe= await models.facilitador.findOne(
                    {  where: { id_persona: req.body.id_persona } }
                )        
                if(!existe)  {
                    const Facilitador= await models.facilitador.create({
                        id_persona:req.body.id_persona,
                        profesion:req.body.profesion,
                        estado:true                                                              
                    })
                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Datos de facilitador registrados Exitosamente",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro: El facilitador ya esta siendo registrado",
                        error:true
                    })
                }
                 
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }
    async  read_facilitador(req,res){
        try {

          let Facilitador = await models.facilitador.findOne({
            attributes: ['id_facilitador','profesion'],
            where: {'id_facilitador': req.params.id_facilitador, estado:true},
            include:[{
                model: models.persona,
                as:'PersonaFacilitador',             
                attributes: ['nombres_per', 'apellidos','nro_ci'],

            }]
          });

          if (Facilitador) {
            res.status(200).json({
              status: 200,
              RegFacilitador: Facilitador
            });
          } else {
            res.status(200).json({
              status: 200,
              mensaje: "Facilitador no registrado",
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
    async  readAll_facilitador(req,res){
        try {
                console.log(req.body);

                let Facilitador = await models.facilitador.findAll({attributes:['id_facilitador','profesion'],
                  where: { estado: true },
                  include:[{
                      model: models.persona,
                      as:'PersonaFacilitador',             
                      attributes: ['nombres_per', 'apellidos', 'nro_ci'],
      
                  }]
                });

                if (Facilitador) {
                  res.status(200).json({
                    status: 200,
                    AllFacilitadores: Facilitador,
                  });

                } else {
                  res.status(200).json({
                    status: 200,
                    mensaje: "No existen facilitadores registrados",
                    error: false,
                  });
                }

                
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }    
    async  update_facilitador(req,res){
        try {
                //console.log(req.body)
                const existe= await models.facilitador.findOne(
                    {  where: { id_facilitador: req.body.id_facilitador, estado:true }     }
                )        
                if(existe)  {
                    const Facilitador= await models.facilitador.update({

                        id_facilitador:req.body.id_facilitador,
                        id_persona:req.body.id_persona,
                        profesion:req.body.profesion,
                        estado:true   
                         
                    },{
                        where:{id_facilitador: req.body.id_facilitador}
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Datos Actualizados Exitosamente",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro: El dato del facilitador no puede ser encontrado",
                        error:true
                    })
                }
                 
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }

    async  delete_facilitador(req,res){
        try {
                //console.log(req.body)
                const existe= await models.facilitador.findOne(
                    {  where: { id_facilitador: req.params.id_facilitador }     }
                )        
                if(existe)  {
                    const Facilitador= await models.facilitador.update({
                        estado:false                             
                    },{
                        where:{id_facilitador: req.params.id_facilitador}
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Datos eliminados",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro: El facilitador no puede ser encontrado",
                        error:true
                    })
                }
                 
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
    }
} 



export const facilitadorController = new FacilitadorController