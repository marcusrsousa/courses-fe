import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'react-simple-snackbar'

import Input from '../input'
import styles from './Course.module.css'
import Button from '../button'
import api from '../../services/api'

function Course() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [openSnackbar] = useSnackbar()

	const[name, setName] = useState()
	const[description, setDescription] = useState()
	const[teacher, setTeacher] = useState()

	useEffect(() => {
		if (id) {
			api.get(`/courses/${id}`)
				.then(res => res.data)
				.then(({ name, description, teacher }) =>{
					setName(name)
					setDescription(description)
					setTeacher(teacher)
				})
		}
	},[id])

	const save = () => {
		navigate('/')
		
		if (id) {
			api.put(`/courses/${id}`, { name, description, teacher }).then(() => openSnackbar('Course updated!'))
			return
		}

		api.post('/courses', { name, description, teacher }).then(() => openSnackbar('Course saved!')).catch( err => openSnackbar(`Error when saved: ${err.error}`))
	}

	const close = () => {
		navigate('/')
	}
	
	return (
		<div className={styles.container}>
			<Input label='Name' value={name} onChange={name => setName(name)}></Input>
			<Input label='Description' value={description} onChange={name => setDescription(name)}></Input>
			<Input label='Teacher' value={teacher} onChange={name => setTeacher(name)}></Input>
			<div className={styles.buttonArea}>
				<Button onClick={close}>Cancel</Button>
				<Button variant="contained" color="primary" onClick={save}>Save</Button>
			</div>
		</div>
	)
}

export default Course