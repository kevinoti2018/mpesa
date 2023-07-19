const Router = require('express')
const axios = require('axios')
const userRoute = Router()
userUrl='/users'
//  middleware to generate token
const getToken = async(req,res,next)=>{
    const consumer= process.env.CONSUMER_KEY
    const secret =process.env.CONSUMER_SECRET
    const auth = new Buffer.from(`${consumer}:${secret}`).toString('base64')
    await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",{
        headers:{
            authorization: `Basic ${auth}`
        }
    }).then((response)=>{
        token=response.data.access_token
      
        next()
    }).catch((err)=>{
        console.log(err.message);
        res.status(400).json(err.message)
    })

}

userRoute.get('/',(req,res)=>{
    res.status(200).json({message:"hello"})
})
userRoute.post(userUrl,getToken,async(req,res)=>{
    const phone = req.body.phone.substring(1)
    const amount =req.body.amount
    const date = new Date()
    const timestamp= 
    date.getFullYear()+
    ("0" + (date.getMonth() +1)).slice(-2)+
    ("0"+ (date.getDate())).slice(-2)+
    ("0" + date.getHours()).slice(-2)+
    ("0" + date.getMinutes()).slice(-2)+
    ("0" + date.getSeconds()).slice(-2)
    const passKey= process.env.PASSKEY
    const shortCode = process.env.SHORTCODE
    const password = new Buffer.from(shortCode + passKey +timestamp).toString('base64') 
    console.log(phone);
    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
            BusinessShortCode:shortCode,
            Password:password,
            Timestamp:timestamp,
            TransactionType:"CustomerPayBillOnline",
            Amount:amount,
            PartyA:`254${phone}`,
            PartyB:shortCode,
            PhoneNumber:`254${phone}`,
            CallbackUrl:'https:mydomain.com/path',
            AccountReference:`254${phone}`,
            TransactionDesc:"Test"
        },
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    ).then((data)=>{
        console.log(data.data);
        res.status(200).json({message:data.data})
    }).catch(err=>{
        console.log(err.message);
        res.status(400).json(err.message)
    })
})

module.exports= userRoute