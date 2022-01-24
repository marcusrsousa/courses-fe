import React, { useEffect, useState } from 'react'
import api from '../../services/api'
import style from './Courses.module.css'
import { MdDelete, MdEdit } from 'react-icons/md'

import { useNavigate } from 'react-router-dom'
import DeleteModal from '../delete-modal'
import { useSnackbar } from 'react-simple-snackbar'
import Button from '../button'
function Courses() {
	const [courses, setCourses] = useState()
	const [message, setMessage] = useState()
	const [id, setId] = useState()

	const [openSnackbar] = useSnackbar()
	const navigate = useNavigate()

	const getCourses = () => api.get('/courses').then((res) => setCourses(res.data))

	useEffect(getCourses, [])


	const openModal = course => {
		setMessage(`The course ${course.name} will be deleted permanently. Are you sure?`)
		setId(course.id)
	}

	const closeModal = () => {
		setMessage(undefined)
		setId(undefined)
	}

	const onDelete = id => api.delete(`/courses/${id}`).then(() => {
		openSnackbar('Course deleted!')
		getCourses()
		closeModal()
	})

	const back = course => navigate(`courses/edit/${course.id}`)

	return (
		<div className={style.container}>
			<div className={style.table}>
				<div className={`${style.row} ${style.title}`}>
					<div>ID</div>
					<div>Name</div>
					<div>Date</div>
					<div></div>
				</div>
				{courses && courses.map(course => (
					<div className={style.row} key={course.id}>
						<div>{course.id}</div>
						<div>{course.name}</div>
						<div>{new Date(course.date).toLocaleDateString('en-US')}</div>
						<div className={style.alignRight}>
							<Button onClick={() => back(course)}><MdEdit></MdEdit></Button>
							<Button onClick={() => openModal(course)}><MdDelete></MdDelete></Button>
						</div>
					</div>
				))}
				<DeleteModal message={message} id={id} onDelete={onDelete} onClose={closeModal}></DeleteModal>
			</div>

		</div>
	)
}

export default Courses
