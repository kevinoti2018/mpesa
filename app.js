const express = require('express')
const userRoute =  require('./routes/users/users.js')
const app =  express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const apiurl='/api/v1'
app.use(apiurl,userRoute)
module.exports ={app}