const Router = require('express');
const axios = require('axios');

const userRoute = Router();
const userUrl = '/users';

// Generate timestamp
function getTransactionTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    return `${year}${month}${date}${hour}${minute}${second}`;
}

// Middleware to generate token
const getToken = async (req, res, next) => {
    const consumer = process.env.CONSUMER_KEY;
    const secret = process.env.CONSUMER_SECRET;
    const auth = Buffer.from(`${consumer}:${secret}`).toString('base64');

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const token = response.data.access_token;
        req.token = token; // Store the token in request object for further use
        next();
    } catch (err) {
        console.log(err.message);
        res.status(400).json(err.message);
    }
};

userRoute.get('/', (req, res) => {
    res.status(200).json({ message: 'hello' });
});

userRoute.post(userUrl, getToken, async (req, res) => {
    const phone = req.body.phone.substring(1);
    const amount = req.body.amount;
    const passKey = process.env.PASSKEY;
    const shortCode = process.env.SHORTCODE;
    const timestamp = getTransactionTimestamp();
    const password = Buffer.from(shortCode + passKey + timestamp).toString('base64');

    try {
        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: parseInt(shortCode),
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: parseInt(`254${phone}`),
                PartyB: parseInt(shortCode),
                PhoneNumber: parseInt(`254${phone}`),
                CallBackURL: 'https://mydomain.com/pat',
                AccountReference: 'Test',
                TransactionDesc: 'Test',
            },
            {
                headers: {
                    Authorization: `Bearer ${req.token}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log(response.data);
        res.status(200).json({ message: response.data });
    } catch (err) {
        console.log(err.message);
        res.status(405).json(err.message);
    }
});




module.exports=userRoute;