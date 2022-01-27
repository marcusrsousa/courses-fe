import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import api from '../../services/api'
import style from './Courses.module.css'

function Courses () {
	const [ courses, setCourses ] = useState()

	const getCourses = () => api.get('/courses').then((res) => setCourses(res.data))

	useEffect(getCourses, [])

	return (
		<div className={style.container}>
			{courses && courses.map(course => (
				<Link key={course.id} to={`/detail/${course.id}`}>
					<div className={style.card}>
						<div className={style.title}>{course.name}</div>
						<div className={style.body}>{course.description}</div>
						<div className={style.author}> Author: {course.teacher}</div>
					</div>
				</Link>
			))}
			
		</div>
	)
}

export default Courses
