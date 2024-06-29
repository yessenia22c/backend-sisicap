require('dotenv').config()

export const config = {
    database: process.env.NAMEDB, 
    username: process.env.USERDB, 
    password: process.env.PASSDB, 
    host: process.env.HOSTDB,
    dialect: 'mysql',
    pool: {
        max:5,
        min:0,
        acquire:30000,
        idle:900000
      
    }
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // }
}