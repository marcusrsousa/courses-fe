import React, { useEffect, useState } from 'react'
import { useModal } from 'react-hooks-use-modal'
import { MdAdd, MdArrowRight, MdCheck, MdDelete, MdEdit } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { useSnackbar } from 'react-simple-snackbar'

import api from '../../services/api'
import Button from '../button'
import { Input, useFocus } from '../input'
import styles from './Course.module.css'

function Course () {
	const { id } = useParams()
	const navigate = useNavigate()
	const [ openSnackbar ] = useSnackbar()

	const [ name, setName ] = useState()
	const [ description, setDescription ] = useState()
	const [ teacher, setTeacher ] = useState()
	const [ chapters, setChapters ] = useState()

	const [ submitted, setSubmitted ] = useState(false)
	const [ deletedChapters, setDeletedChapters ] = useState([])


	useEffect(async () => {
		if (id) {
			const { data: { name, description, teacher, chapters } } = await api.get(`/courses/${id}`)
			setName(name)
			setDescription(description)
			setTeacher(teacher)
			setChapters(normalize(chapters))
		}
	},[ id ])

	const normalize = chapters => {
		return chapters.map(chapter => ({ ...chapter, lessons: chapter.lessons.map(lesson => ({ ...lesson, videoLink: lesson.video_link })) }))
	}

	const desnormalize = lesson => {
		return { ...lesson, video_link: lesson.videoLink }
	}

	const saveChapters = async courseId => {
		try {
			chapters.forEach(async chapter => {
				if (chapter.id === 0) {
					const newChapter = await api.post(`/courses/${courseId}/chapters`, chapter)
					chapter.lessons.forEach(async lesson => await api.post(`/chapters/${newChapter.data.id}/lessons`, desnormalize(lesson)))	
					return
				}
				await api.put(`/chapters/${chapter.id}`, chapter)
			
				chapter.lessons.forEach(async lesson => {
					if (lesson.id === 0) {
						await api.post(`/chapters/${chapter.id}/lessons`, desnormalize(lesson))
						return
					}
					await api.put(`/lessons/${lesson.id}`, desnormalize(lesson))
				})

				if (chapter.deletedLessons) {
					chapter.deletedLessons.forEach(async lessonId => await api.delete(`/lessons/${lessonId}`))
				}
			})
			deletedChapters.forEach(async chapterId => await api.delete(`/chapters/${chapterId}`))
		} catch (err) {
			openSnackbar(`Error when saved: ${err.error}`)
		}
		
		showMessageAndClose('Course saved!')
	}

	const save = async () => {
		setSubmitted(true)

		if (!name || !description || !teacher) {
			return
		}

		try {
			
			if (id) {
				await api.put(`/courses/${id}`, { name, description, teacher })
				saveChapters(id)
				return
			}

			const course = await api.post('/courses', { name, description, teacher })
			saveChapters(course.data.id)

		} catch (err) {
			openSnackbar(`Error when saved: ${err.error}`)
		}
	}

	const showMessageAndClose = (message) => {
		openSnackbar(message)
		navigate('/')
	}

	const close = () => {
		navigate('/')
	}

	const deleteChapter = chapter => {
		setChapters([ ...chapters.filter(c => c.id !== chapter.id) ])

		if (!chapter.id) {
			return
		}

		setDeletedChapters([ ...deletedChapters, chapter.id ])
	}
	
	return (
		<div className={styles.container}>
			<Input label='Name' required submitted={submitted} value={name} onChange={name => setName(name)}></Input>
			<Input label='Description' required submitted={submitted} value={description} onChange={description => setDescription(description)}></Input>
			<Input label='Teacher' required submitted={submitted} value={teacher} onChange={teacher => setTeacher(teacher)}></Input>
			<div>
				<div className={styles.spaceBetween} ><h2>Chapters</h2> <Button color="secondary" size="large" onClick={() =>setChapters([ ...chapters, { id: 0, name: undefined } ])}><MdAdd></MdAdd></Button> </div>
				{chapters && chapters.map((chapter) => chapter && <Chapter key={`chapter-${chapter.id}`} chapter={chapter} onDelete={() => deleteChapter(chapter)} onChange={c => setChapters([ ...chapters.filter(ch => ch.id !== chapter.id), c ])}></Chapter>)}
			</div>
			<div className={styles.buttonArea}>
				<Button onClick={close}>Cancel</Button>
				<Button variant="contained" color="primary" onClick={save}>Save</Button>
			</div>
		</div>)
}

function Chapter (props) {
	const { chapter } = props
	const [ open, setOpen ] = useState(false)
	const [ lessons, setLessons ] = useState(chapter.lessons ? chapter.lessons : [])
	const [ lesson, setLesson ] = useState()

	const saveLesson = lesson => {
		const updatedLessons = [ ...lessons.filter(l => l.id !== lesson.id), lesson ]
		setLessons(updatedLessons)
		props.onChange({ ...chapter, lessons: updatedLessons })
	}

	const deleteLesson = lesson => {
		const newLessons = lessons.filter(l => l.id !== lesson.id)
		if (newLessons.length === 0) {
			setOpen(false)
		}

		setLessons([ ...newLessons ])

		if (!lesson.id) {
			return
		}

		if (!chapter.deletedLessons) {
			chapter.deletedLessons = []
		}
		chapter.deletedLessons = [ ...chapter.deletedLessons, lesson.id ]
		props.onChange(chapter)
		
	}

	return (<div>
		<div className={`${styles.chapter}`}>
			<div className={styles.spaceBetween}>
				<div className={styles.spaceBetween}>
					{lessons.length > 0 && (
						<Button size='large'><MdArrowRight className={open && styles.rotate} onClick={() => setOpen(!open)}></MdArrowRight></Button>
					)}
					<LabelInput value={ chapter.name } onChange={ name => props.onChange({ ...chapter, name })}></LabelInput>
				</div>
				<div className={styles.spaceBetween}>
					<Button><MdDelete onClick={() => props.onDelete(chapter)}></MdDelete></Button>
					<Button onClick={() => setLesson({ id: 0, name: undefined })}><MdAdd></MdAdd></Button>
				</div>
			</div>
			{open && (
				<div>
					<div className={styles.line}></div>
					<h3>Lessons</h3>
					{lessons.map(lesson => (<div  key={`lesson-${lesson.id}`} className={styles.spaceBetween}>
						<span>{lesson.name}</span>
						<div className={styles.spaceBetween}>
							<Button onClick={() => setLesson(lesson)}><MdEdit></MdEdit></Button>
							<Button><MdDelete onClick={() => deleteLesson(chapter)}></MdDelete></Button>
						</div>
					</div>))}
				</div>)}
		</div>
		<LessonModal lesson={lesson} onSave={lesson => saveLesson(lesson)}></LessonModal>
	</div>)
}

function LabelInput (props) {
	const [ edit, setEdit ] = useState(!props.value)
	const [ inputRef, setInputFocus ] = useFocus()
	const [ inputValue, setInputValue ] = useState(props.value)
	

	useEffect(() => setInputFocus(), [ edit ])
	
	
	const onChange = () => {
		props.onChange(inputValue)
		setEdit(false)
	}
	return (<>
		{ !edit && <div className={styles.spaceBetween}><label className={styles.labelInput}>{props.value}</label> <Button onClick={ () => setEdit(true) }><MdEdit></MdEdit></Button></div> }
		{ edit && <div className={styles.spaceBetween}><input ref={inputRef} type='text' defaultValue={inputValue} onBlur={e => setInputValue(e.target.value)} /> <Button onClick={ onChange }><MdCheck></MdCheck> </Button></div>}
	</>)
}


function LessonModal (props) {
	const [ Modal, open, close ] = useModal('root', {
		preventScroll: true,
		closeOnOverlayClick: false
	})

	const [ name, setName ] = useState()
	const [ description, setDescription ] = useState()
	const [ videoLink, setVideoLink ] = useState()
	const [ submitted, setSubmitted ] = useState()


	useEffect(() =>	{
		if (props.lesson) {
			const { name, description, videoLink } = props.lesson
			setName(name)
			setDescription(description)
			setVideoLink(videoLink)
			open()
		} }, [ props.lesson ])

	const onSave = () => {
		if (!name || !description || !videoLink) {
			setSubmitted(true)
			return
		}
		setSubmitted(false)
		props.onSave({
			id: props.lesson.id,
			name,
			description,
			videoLink
		})
		close()
	}

	const onClose = () => {
		setSubmitted(false)
		props.onClose && props.onClose()
		close()
	}

	return (
		<div>
			<Modal>
				<div className={styles.modal}>
					<Input label='Name' required submitted={submitted} value={name} onChange={name => setName(name)}></Input>
					<Input label='Description' required submitted={submitted} value={description} onChange={description => setDescription(description)}></Input>
					<Input label='Video URL' required submitted={submitted} value={videoLink} onChange={videoLink => setVideoLink(videoLink)}></Input>
			
					<div className={styles.alignRight}>
						<Button onClick={onClose}>Close</Button>
						<Button onClick={onSave} color="primary" variant="contained">Save</Button>
					</div>
				</div>
			</Modal>
		</div>

	)
}


export default Course