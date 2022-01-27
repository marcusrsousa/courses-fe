import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import api from '../../services/api'
import Button from '../button'
import styles from './CourseDetail.module.css'

function CourseDetail () {
	const { id } = useParams()
	const navigate = useNavigate()

	const [ name, setName ] = useState()
	const [ description, setDescription ] = useState()
	const [ teacher, setTeacher ] = useState()
	const [ chapters, setChapters ] = useState()



	useEffect(async () => {
		const { data: { name, description, teacher, chapters } } = await api.get(`/courses/${id}`)
		setName(name)
		setDescription(description)
		setTeacher(teacher)
		setChapters(chapters)
	},[])


	
	return (
		<div className={styles.container}>
			<div>
				<div className={styles.title}>{name}</div>
				<div className={styles.author}>Author: {teacher}</div>
				<div className={styles.description}>{description}</div>
				<div className={styles.chapters}>
					<h4>Chapters</h4>
					{chapters && chapters.map((chapter, i) => chapter && <div key={`chapter-${chapter.id}`}>{i + 1}. {chapter.name}</div>)}
				</div>
				<div className={styles.buttonArea}>
					<Button onClick={() => navigate('/')}>Back</Button>
				</div>
			</div>
		</div>)

}


export default CourseDetail