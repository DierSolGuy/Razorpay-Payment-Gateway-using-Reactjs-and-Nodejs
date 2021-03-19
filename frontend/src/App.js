import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Axios from 'axios'

function loadScript(src) {
	return new Promise((resolve) => {
		const script = document.createElement('script')
		script.src = src
		script.onload = () => {
			resolve(true)
		}
		script.onerror = () => {
			resolve(false)
		}
		document.body.appendChild(script)
	})
}

const __DEV__ = document.domain === 'localhost'
//const __PROD__ = document.domain === 'mywebsite.com'



function App() {
	const [name, setName] = useState('Sourish Mukherjee')
	const [email,setEmail] = useState('algrenzservices46@gmail.com')
	const [number,setNumber] = useState(8017578832)

	async function displayRazorpay() {
		
		// Loading the Razorpay Link While Link is clicked.
		
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?')
			return
		}

		const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' })
			.then((t) =>
				t.json()
			)
			console.log(data)

		const options = {
			key: __DEV__ ? process.env.KEY_ID : 'PRODUCTION_KEY',
			//key: __PROD__? process.env.KEY_ID : 'DEVELOPMENT KEY',
			currency: data.currency,
			amount: data.amount.toString(),
			order_id: data.id,
			name: 'Donation',
			description: 'Thank you for nothing. Please give us some money',
			image: 'http://localhost:1337/logo.svg',
			handler: function (response) {
				alert(response.razorpay_payment_id)
				alert(response.razorpay_order_id)
				alert(response.razorpay_signature)
			},
			prefill: {
				name,
				email,
				number
			}
		}
		const paymentObject = new window.Razorpay(options)
		paymentObject.open()
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>

				<a
					className="App-link"
					onClick={displayRazorpay}
					target="_blank"
					rel="noopener noreferrer"
				>
				<button> Pay Now </button>
				</a>
			</header>
			<form>
				<script src="https://checkout.razorpay.com/v1/payment-button.js" data-payment_button_id="pl_GoQzsYuv6tFkVH" async>
				</script>
			</form>
		</div>
	)
}

export default App
