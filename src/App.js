import React from 'react'
import './App.css'
import Courses from './components/courses'
import { Routes, Route, Link } from 'react-router-dom'
import Course from './components/course'

function App() {
	return (
		<div className="App">
			<header className="App-header">
				<Link to="/">Courses</Link>
			</header>
	
			<Routes>
				<Route path="/" element={<Courses />} />
				<Route path="courses" element={<Courses />} />
				<Route path="courses/edit/:id" element={<Course />} />
			</Routes>	
		</div>			
	)
}

export default App
