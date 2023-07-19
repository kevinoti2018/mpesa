const Mpesa =  require('mpesa-api').Mpesa
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './config/config.env') });
const {app} =  require('./app')

process.on('uncaughtException',(err)=>{
    console.log('uncaught exception error' ,err.message);
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is running in http://localhost:${process.env.PORT} , in ${process.env.NODE_ENV} mode`)
})

process.on('unhandledRejection',(err)=>{
    console.log('unhandled error occured', err);
    server.close()
})