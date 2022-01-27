import React from 'react'
import jwt_decode from 'jwt-decode'
import { MdLogout } from 'react-icons/md'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'

import './App.css'
import Course from './components/course'
import Courses from './components/courses'
import AdminCourses from './components/admin-courses'
import PrivateRoute from './components/private-route'
import MyRipple from './components/ripple'
import CourseDetail from './components/course-detail'

function App () {
	const navigate = useNavigate()
	const token = localStorage.getItem('Token')
	const user = token && jwt_decode(token)

	const isPrivate = !(window.location.pathname.startsWith('/detail') || window.location.pathname === '/')

	const logout = () => {
		localStorage.removeItem('Token')
		navigate('/admin')
	}

	return (
		<div className="App">
			<header className="App-header">
				<Link to="/">Courses</Link>
				{user && isPrivate && (<div className='user-box'>
					<span>{user.name}</span>
					<MyRipple variant='contained'><MdLogout className='link' onClick={logout}></MdLogout></MyRipple>
				</div>)}
			</header>
			<Routes>
				<Route  path="/" element={<Courses />} />
				<Route  path="/detail/:id" element={<CourseDetail />} />
				<Route  path="*" element={<PrivateRoute>
					<Routes>
						<Route  path="admin" element={<AdminCourses />} />
						<Route  path="admin/courses" element={<AdminCourses />} />
						<Route  path="admin/courses/new" element={<Course />} />
						<Route  path="admin/courses/edit/:id" element={<Course />} />
					</Routes>	
				</PrivateRoute>} />
			</Routes>	
		</div>			
	)
}

export default App
