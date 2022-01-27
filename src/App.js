import React from 'react'
import jwt_decode from 'jwt-decode'

import './App.css'
import Courses from './components/courses'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Course from './components/course'
import PrivateRoute from './components/private-route'
import { MdLogout } from 'react-icons/md'
import MyRipple from './components/ripple'

 

 

function App() {
	const navigate = useNavigate()
	const token = localStorage.getItem('Token')
	const user = token && jwt_decode(token)

	const logout = () => {
		localStorage.removeItem('Token')
		navigate('/')
	}

	return (
		<div className="App">
			<header className="App-header">
				<Link to="/">Courses</Link>
				{user && (<div className='user-box'>
					<span>{user.name}</span>
					<MyRipple variant='contained'><MdLogout className='link' onClick={logout}></MdLogout></MyRipple>
				</div>)}
			</header>
			<PrivateRoute>
				<Routes>
					<Route  path="/" element={<Courses />} />
					<Route  path="courses" element={<Courses />} />
					<Route  path="courses/new" element={<Course />} />
					<Route  path="courses/edit/:id" element={<Course />} />
				</Routes>	
			</PrivateRoute>
		</div>			
	)
}

export default App
