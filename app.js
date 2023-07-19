const express = require('express')
const userRoute =  require('./routes/users/users.js')
const paybill =  require('./routes/c2b/paybilll.js')
const app =  express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const apiurl='/api/v1'
app.use(apiurl,userRoute)
app.use('/paybill',paybill)
module.exports ={app}