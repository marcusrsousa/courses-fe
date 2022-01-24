import React, { useEffect } from 'react'
import { useModal } from 'react-hooks-use-modal' 
import Button from '../button'
import style from './DeleteModal.module.css'



function DeleteModal(props) {
	const [Modal, open, close] = useModal('root', {
		preventScroll: true,
		closeOnOverlayClick: false
	})

	useEffect(() =>	props.message && open(), [props.message])

	const onDelete = () => {
		props.onDelete(props.id)
		close()
	}

	const onClose = () => {
		props.onClose()
		close()
	}


	return (
		<div>
			<Modal>
				<div className={style.modal}>
					<h2>Delete confirmation</h2>
					<p>{props.message}</p>
					<div className={style.alignRight}>
						<Button onClick={onClose}>Close</Button>
						<Button onClick={onDelete} color="primary" variant="contained">Save</Button>
					</div>
				</div>
			</Modal>
		</div>

	)
}


export default DeleteModal