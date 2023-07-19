const Router =  require('express')
const paybill =  Router()


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



module.exports = paybill