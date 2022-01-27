import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal' 
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-simple-snackbar'

import api from '../../services/api'
import Button from '../button'
import { Input } from '../input'
import style from './Login.module.css'


function Login () {
	const [ Modal, open, close ] = useModal('root', {
		preventScroll: true,
		closeOnOverlayClick: false
	})

	const [ email, setEmail ] = useState()
	const [ password, setPassword ] = useState()
	const [ submitted, setSubmitted ] = useState(false)
	const [ openSnackbar ] = useSnackbar()
	const navigate = useNavigate()

	useEffect(() =>	open(), [])

	const onLogin = () => {
		setSubmitted(true)
		if (!email || !password) {
			return
		}
		
		api.post('/login', {
			email, password
		})
			.then(res => res.data)
			.then(({ token }) => {
				localStorage.setItem('Token', token)
				navigate('/admin')
				close()
			}).catch(err => openSnackbar(`Error when login: ${err.response.status === 404 ? 'Email or Password are invalid' :err.message}`))	
		
	}


	return (
		<div>
			<Modal>
				<div className={style.modal}>
					<h2>Login</h2>
					<Input label='Login' color="primary" required submitted={submitted} value={email} onChange={email => setEmail(email)}></Input>
					<Input label='Password' color="primary" required submitted={submitted} type="password" value={password} onChange={password => setPassword(password)}></Input>
					
					<div className={style.alignRight}>
						<Button onClick={onLogin} color="primary" variant="contained">Login</Button>
					</div>
				</div>
			</Modal>
		</div>

	)
}


export default Login