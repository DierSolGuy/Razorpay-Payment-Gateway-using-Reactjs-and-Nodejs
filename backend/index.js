/* For CORS Error,
1. Enable some sort of proxy mechanism, for that we need a web pack dev server setup for that.
	So that we can proxy certain request from frontend to backend.
2. (Not Reccommended for production)Enable CORS on the existing server*/ 

// Web Hooks is basically verification of the request of the payment.

const app = require('express')()
const path = require('path')
const shortid = require('shortid')
const Razorpay = require('razorpay')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_uaCZoDBV5I88Br',
	key_secret: 't2gvIaas21E4exCRwftCo3cj'
})

app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'logo.svg'))
})

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '987654321'

	console.log(req.body)

	// Doing HMAC encryption of the payload which we are getting from the req.body
	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay', async (req, res) => {
	const payment_capture = 1
	const amount = 10
	const currency = 'INR'

	const options = {
		amount: amount * 10,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})

app.listen(1337, () => {
	console.log('Listening on 1337')
})
