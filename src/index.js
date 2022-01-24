import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import SnackbarProvider from 'react-simple-snackbar'

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<SnackbarProvider>
				<App />
			</SnackbarProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
)

