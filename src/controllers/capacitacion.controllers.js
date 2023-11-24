import{capacitacion} from './../models'
import  models from './../models'

class CapacitacionController{
    async  create_capacitacion(req,res){
        try {
                //console.log(req.body)

                const existe= await capacitacion.findOne(
                    {  where: { nombre_capacitacion: req.body.nombre_capacitacion }     }
                )        
                if(!existe)  {
                    const Capacitacion= await capacitacion.create({
                        nombre_capacitacion:req.body.nombre_capacitacion,
                        fecha_inicio_cap:req.body.fecha_inicio_cap,
                        fecha_fin_cap:req.body.fecha_fin_cap,
                        cantidad_modulos:req.body.cantidad_modulos,
                        id_categoria:req.body.id_categoria,
                        estado:true,
                        vigente: true
                                                  
                    })
                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Capacitación creada exitosamente",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"La capacitación ya exite",
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
    async  read_capacitacion(req,res){
        try {
                //console.log(req.body)
           
                
                let Capacitacion=await models.capacitacion.findOne({
                    attributes: ['id_capacitacion', 'nombre_capacitacion', 'fecha_inicio_cap', 'fecha_fin_cap', 'cantidad_modulos','vigente'],
                    where:{'id_capacitacion':req.params.id_capacitacion, estado:true},
                    include:[
                        {
                        model: models.categoria,
                        as: 'Categoria',            
                        attributes: ['id_categoria','nombre_categoria'],
                        }
                    ]
                
                })
                    if(Capacitacion){
                        res.status(200).json({
                            status:200,
                            UnaCapacitacion:Capacitacion
                        })  
                    }else{
                        res.status(200).json({
                            status:200,
                            mensaje:"No existe esta capacitación.",
                            error:false
                        })  
                    }

                
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }
    async  readAll_capacitacion(req,res){
        try {
                //console.log(req.body)
                         
                let Capacitacion=await models.capacitacion.findAll({
                    attributes: ['id_capacitacion', 'nombre_capacitacion', 'fecha_inicio_cap', 'fecha_fin_cap', 'cantidad_modulos','vigente'],
                    where:{estado:true},
                    include:[
                        {
                        model: models.categoria,
                        as: 'Categoria',            
                        attributes: ['id_categoria','nombre_categoria'],//Cambio ahora devolvemos el id_capacitacion
                        }
                    ]
                })
                 
                    if(Capacitacion){
                        res.status(200).json({
                            status:200,
                            UnaCapacitacion:Capacitacion
                        })  
                    }else{
                        res.status(200).json({
                            status:200,
                            mensaje:"No existe capacitaciones.",
                            error:false
                        })  
                    }

                
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }    
    async  update_capacitacion(req,res){
        try {
                //console.log(req.body)
                const existe= await models.capacitacion.findOne(
                    {  where: { id_capacitacion: req.body.id_capacitacion, estado:true }     }
                )        
                if(existe)  {
                    const Capacitacion= await models.capacitacion.update({
                        nombre_capacitacion:req.body.nombre_capacitacion,
                        fecha_inicio_cap:req.body.fecha_inicio_cap,
                        fecha_fin_cap:req.body.fecha_fin_cap,
                        cantidad_modulos:req.body.cantidad_modulos,
                        id_categoria:req.body.id_categoria,
                        estado:true
                         
                    },{
                        where:{id_capacitacion: req.body.id_capacitacion}
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Datos Actualizados Exitosamente",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro: La capacitación no puede ser encontrada",
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

    async  delete_capacitacion(req,res){
        try {
                //console.log(req.body)
                const existe= await models.capacitacion.findOne(
                    {  where: { id_capacitacion: req.params.id_capacitacion,}     }
                )        
                if(existe)  {
                    const Capacitacion= await models.capacitacion.update({
                        estado:false                             
                    },{
                        where:{id_capacitacion: req.params.id_capacitacion }
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Capacitación eliminada",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro. Capacitacion no encontrada",
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
    async  terminar_capacitacion(req,res){
        try {
                //console.log(req.body)
                const existe= await models.capacitacion.findOne(
                    {  where: { id_capacitacion: req.params.id_capacitacion,}     }
                )        
                if(existe)  {
                    const Capacitacion= await models.capacitacion.update({
                        vigente:false                             
                    },{
                        where:{id_capacitacion: req.params.id_capacitacion }
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Capacitación finalizada",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro. Capacitacion no encontrada",
                        error:true
                    })
                }
            } 
            catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
    }
    async  listarCategoria(req,res){
        try {
                //console.log(req.body)
                         
                let CategoriaCap=await models.categoria.findAll({
                    attributes: ['id_categoria', 'nombre_categoria'],
                    where:{estado:true},
                    
                })
                 
                    if(CategoriaCap){
                        res.status(200).json({
                            status:200,
                            Categoria:CategoriaCap
                        })  
                    }else{
                        res.status(200).json({
                            status:200,
                            mensaje:"No existen categorias",
                            error:false
                        })  
                    }

                
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     } 

     async noVigenteCapaciatcion(req,res){
        try {
            //console.log(req.body)
            const existe= await models.capacitacion.findOne(
                {  where: { id_capacitacion: req.params.id_capacitacion,}     }
            )        
            if(existe)  {
                if(existe.vigente==false){
                    const Capacitacion= await models.capacitacion.update({
                        vigente:true
                    },{
                        where:{id_capacitacion: req.params.id_capacitacion }
                    })
                                                                        
                    res.status(200).json({
                        status:200,
                        mensaje:"Capacitación puesta en vigente",
                        error:false
                    })
                }else{
                    const Capacitacion= await models.capacitacion.update({
                        vigente:false                             
                    },{
                        where:{id_capacitacion: req.params.id_capacitacion }
                    })
                    
                                                                        
                    res.status(200).json({
                        status:200,
                        mensaje:"Capacitación dada de baja",
                        error:false
                    })
                }
                
            }else{
                res.status(422).json({
                    status:422,
                    mensaje:"El sistema no puede completar el registro. Capacitacion no encontrada",
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

export const capacitacionController = new CapacitacionController
