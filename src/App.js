import React from 'react'
import jwt_decode from 'jwt-decode'
import { MdLogout } from 'react-icons/md'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import './App.css'
import Course from './components/course'
import Courses from './components/courses'
import PrivateRoute from './components/private-route'
import MyRipple from './components/ripple'




function App () {
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
