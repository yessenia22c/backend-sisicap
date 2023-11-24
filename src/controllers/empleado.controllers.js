import models from './../models'

class EmpleadoController{
    async  create_empleado(req,res){
        try {
                //console.log(req.body)
                const { UnaPersonaEmpleado } = req.body;
                //console.log(req.body);
                const existePersona= await models.persona.findOne(
                    {  where: { nro_ci: UnaPersonaEmpleado.nro_ci }     }
                ) 
                // Crear una nueva persona con los datos proporcionados
                if (!existePersona) {
                  const UnaPersona = await models.persona.create({
                    nombres_per: UnaPersonaEmpleado.nombres_per,
                    apellidos: UnaPersonaEmpleado.apellidos,
                    nro_ci: UnaPersonaEmpleado.nro_ci,
                    id_sexo: UnaPersonaEmpleado.id_sexo,
                    correo: UnaPersonaEmpleado.correo,
                    telefono: UnaPersonaEmpleado.telefono,
                    id_ciudad: UnaPersonaEmpleado.id_ciudad,
                    fecha_nac: UnaPersonaEmpleado.fecha_nac,
                    id_pais: UnaPersonaEmpleado.id_pais,
                    estado: true,
                  });
                  const UnEmpleado = await models.empleado.create({
                    id_cargo: req.body.id_cargo,
                    id_persona: UnaPersona.id_persona,
                    fecha_contrato: req.body.fecha_contrato,
                    id_empresa_empleadora: req.body.id_empresa_empleadora,
                    estado: true,
                  });
                  //console.log('Un empleado',UnEmpleado);

                  const EmpleadoRegistrado = await models.empleado.findOne({
                    attributes: ["id_empleado", "fecha_contrato"],
                    where: { id_empleado: UnEmpleado.id_empleado, estado: true },
                    include: [
                      {
                        model: models.persona,
                        as: "PersonaEmpleado",
                        attributes: [
                            "id_persona",
                            "nombres_per",
                            "apellidos",
                            "nro_ci",
                            "correo",
                            "telefono",
                            "fecha_nac",
                          ],
                  
                        //   where: { id_persona: req.params.id_persona, estado: true },
                          include: [
                            {
                              model: models.sexo,
                              attributes: ["id_sexo","nombre_sexo"],
                            },
                            {
                              model: models.ciudad,
                              attributes: ["id_ciudad","nombre_ciudad"],
                            },
                            {
                              model: models.pais,
                              as: "Pais",
                              attributes: ["id_pais","nombre_pais"],
                            },
                          ],
                      },
                      {
                        model: models.empresa_empleadora,
                        attributes: ["id_empresa","nombre_empleador"],
                      },
                      {
                        model: models.cargo,
                        attributes: ["id_cargo","nombre_cargo"],
                      },
                    ],
                  });

                  res.status(200).json({
                    status: 200,
                    datoNuevoEmpleado: EmpleadoRegistrado,
                    mensaje: "Datos de empleado registrados Exitosamente",
                    error: false,
                  });
                } else {
                  res.status(422).json({
                    status: 422,
                    mensaje:
                      "Ya existe una persona registrada con el numero de carnet proporcionado",
                    error: true,
                  });
                }
                 
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }
     async  create_AsignarEmpleado(req,res){
        try {
                //console.log(req.body)
                //const { UnaPersonaEmpleado } = req.body;
                //console.log(req.body);
                const existePersona= await models.empleado.findOne(
                    {  where: { id_persona: req.body.id_persona }     }
                ) 
                // Crear una nueva persona con los datos proporcionados
                if (!existePersona) {
                  const UnEmpleado = await models.empleado.create({
                    id_persona: req.body.id_persona,
                    id_cargo: req.body.id_cargo,                    
                    fecha_contrato: req.body.fecha_contrato,
                    id_empresa_empleadora: req.body.id_empresa_empleadora,
                    estado: true,
                  });
                  //console.log('Un empleado',UnEmpleado);

                  const EmpleadoRegistrado = await models.empleado.findOne({
                    attributes: ["id_empleado", "fecha_contrato"],
                    where: { id_empleado: UnEmpleado.id_empleado, estado: true },
                    include: [
                      {
                        model: models.persona,
                        as: "PersonaEmpleado",
                        attributes: [
                            "id_persona",
                            "nombres_per",
                            "apellidos",
                            "nro_ci",
                            "correo",
                            "telefono",
                            "fecha_nac",
                          ],
                  
                        //   where: { id_persona: req.params.id_persona, estado: true },
                          include: [
                            {
                              model: models.sexo,
                              attributes: ["id_sexo","nombre_sexo"],
                            },
                            {
                              model: models.ciudad,
                              attributes: ["id_ciudad","nombre_ciudad"],
                            },
                            {
                              model: models.pais,
                              as: "Pais",
                              attributes: ["id_pais","nombre_pais"],
                            },
                          ],
                      },
                      {
                        model: models.empresa_empleadora,
                        attributes: ["id_empresa","nombre_empleador"],
                      },
                      {
                        model: models.cargo,
                        attributes: ["id_cargo","nombre_cargo"],
                      },
                    ],
                  });

                  res.status(200).json({
                    status: 200,
                    datoNuevoEmpleado: EmpleadoRegistrado,
                    mensaje: "Datos de empleado registrados Exitosamente",
                    error: false,
                  });
                } else {
                  res.status(422).json({
                    status: 422,
                    mensaje:
                      "Ya existe esta persona asociada a un empleado",
                    error: true,
                  });
                }
                 
          
        } catch (error) {
            res.status(500).json({
                status:500,
                mensaje:error.message
            })
        }
         
     }

     async personasNoEmpleados(req,res){
        try {
            const personasNoEmpleados= await models.persona.findAll({
                attributes:['id_persona','nombres_per','apellidos','nro_ci'],
                where:{estado:true},
                include:[
                    {
                        model: models.empleado,
                        as: 'PersonaEmpleado',
                        attributes: ['id_empleado','id_persona'],
                        where:{estado:true},
                        required: false
                    }
                ],
                having: {
                    id_empleado: null
                }
            })
            if(personasNoEmpleados){
                res.status(200).json({
                    status:200,
                    personasNoEmpleados:personasNoEmpleados
                })
            }else{
                res.status(200).json({
                    status:200,
                    mensaje:"No existen personas registradas",
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
    async  read_empleado(req,res){
        try {
                //console.log(req.body)
           
                
                let Empleado=await models.empleado.findOne({
                    attributes:['id_empleado','fecha_contrato'],
                    where:{'id_empleado':req.params.id_empleado, estado:true},
                    include:[
                        {
                        model: models.persona, 
                        as: 'PersonaEmpleado',           
                        attributes: ['nombres_per', 'apellidos','nro_ci'],
                        },
                        {
                            model: models.empresa_empleadora,            
                            attributes: ['id_empresa','nombre_empleador'],
                        },
                        {
                            model: models.cargo,            
                            attributes: ['nombre_cargo'],
                        }
                    ]
                })

                
                    if(Empleado){
                        res.status(200).json({
                            status:200,
                            Datos_empleado: Empleado
                        })  
                    }else{
                        res.status(200).json({
                            status:200,
                            mensaje:"Empleado no registrado",
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
    async  readAll_empleado(req,res){
        try {
                let Empleado = await models.empleado.findAll({
                  attributes: ["id_empleado", "fecha_contrato"],
                  where: { estado: true },
                  include: [
                    {
                      model: models.persona,
                      as: "PersonaEmpleado",
                      attributes: [
                        "id_persona",
                        "nombres_per",
                        "apellidos",
                        "nro_ci",
                        "correo",
                        "telefono",
                        "fecha_nac",
                      ],

                      //   where: { id_persona: req.params.id_persona, estado: true },
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
                    },
                    {
                      model: models.empresa_empleadora,
                      attributes: ["id_empresa", "nombre_empleador"],
                    },
                    {
                      model: models.cargo,
                      attributes: ["id_cargo", "nombre_cargo"],
                    },
                  ],
                });
                    if(Empleado){
                        
                        res.status(200).json({
                            status:200,                           
                            Empleados:Empleado

                        })  
                    }else{
                        res.status(200).json({
                            status:200,
                            mensaje:"No existen empleados registrados",
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
    async  update_empleado(req,res){
        try {
                console.log(req.body)
                const { UnaPersonaEmpleado } = req.body;
                const existe= await models.empleado.findOne(
                    {  where: { id_empleado: req.body.id_empleado, estado:true }     }
                )        
                if(existe)  {
                    const UnaPersona = await models.persona.update({
                      id_persona: UnaPersonaEmpleado.id_persona,
                      nombres_per: UnaPersonaEmpleado.nombres_per,
                      apellidos: UnaPersonaEmpleado.apellidos,
                      nro_ci: UnaPersonaEmpleado.nro_ci,
                      id_sexo: UnaPersonaEmpleado.id_sexo,
                      correo: UnaPersonaEmpleado.correo,
                      telefono: UnaPersonaEmpleado.telefono,
                      id_ciudad: UnaPersonaEmpleado.id_ciudad,
                      fecha_nac: UnaPersonaEmpleado.fecha_nac,
                      id_pais: UnaPersonaEmpleado.id_pais,
                      estado: true,
                    },{
                        where:{id_persona: UnaPersonaEmpleado.id_persona}           
                    });
                    const Empleado= await models.empleado.update({
                        //id_empleado:req.body.id_empleado,
                        id_cargo:req.body.id_cargo,
                        //id_persona:req.body.id_persona,
                        fecha_contrato:req.body.fecha_contrato,
                        id_empresa_empleadora: req.body.id_empresa_empleadora,
                        estado:true   
                         
                    },{
                        where:{id_empleado: req.body.id_empleado}
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Datos Actualizados Exitosamente",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro: El empleado no puede ser encontrado",
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

    async  delete_empleado(req,res){
        try {
                console.log(req.body)
                const existe= await models.empleado.findOne(
                    {  where: { id_empleado: req.params.id_empleado }     }
                )        
                if(existe)  {
                    const Empleado= await models.empleado.update({
                        estado:false                             
                    },{
                        where:{id_empleado: req.params.id_empleado}
                    })

                                                                            
                    res.status(200).json({
                        status:200,
                        mensaje:"Empleado Eliminado",
                        error:false
                    })
                }else{
                    res.status(422).json({
                        status:422,
                        mensaje:"El sistema no puede completar el registro: El empleado no puede ser encontrado",
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
    async readAll_cargos(req,res){
        try {
            const Cargos= await models.cargo.findAll({
                attributes:['id_cargo','nombre_cargo'],
                where:{estado:true}
            })
            if(Cargos){
                res.status(200).json({
                    status:200,
                    Cargos:Cargos
                })
            }else{
                res.status(200).json({
                    status:200,
                    mensaje:"No existen cargos registrados",
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
    async readAll_empresas(req,res){
        try {
            const Empresas= await models.empresa_empleadora.findAll({
                attributes:['id_empresa','nombre_empleador'],
                where:{estado:true}
            })
            if(Empresas){
                res.status(200).json({
                    status:200,
                    Empresas:Empresas
                })
            }else{
                res.status(200).json({
                    status:200,
                    mensaje:"No existen empresas registradas",
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
} 
export const empleadoController= new EmpleadoController