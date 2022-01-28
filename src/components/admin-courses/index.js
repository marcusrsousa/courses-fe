import React, { useEffect, useState } from 'react'
import { MdAdd, MdDelete, MdEdit } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-simple-snackbar'

import api from '../../services/api'
import Button from '../button'
import DeleteModal from '../delete-modal'
import style from './AdminCourses.module.css'

function AdminCourses () {
	const [ courses, setCourses ] = useState()
	const [ message, setMessage ] = useState()
	const [ id, setId ] = useState()

	const [ openSnackbar ] = useSnackbar()
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
			<div className={`${style.fullSize} ${style.alignRight} ${style.paddingBottom}`}>
				<Link to="/admin/courses/new"><Button color="secondary" variant="contained" size="large"><MdAdd></MdAdd></Button></Link>
			</div>
			<div className={`${style.fullSize} ${style.table}`}>
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

export default AdminCourses
