import React, { useEffect, useRef, useState } from 'react'
import styles from './Input.module.css'

function Input(props) {
	const [focused, setFocused] = useState(false)
	const [filled, setFilled] = useState(false)
	const [inputRef, setInputFocus] = useFocus()
	
	const onBlur = (e) => {
		props.onChange(e.target.value)
		setFocused(false)
		setFilled(!!e.target.value)       
	}

	const inputFocus = () => {
		setFocused(true)  
		setInputFocus()      
	}

	useEffect(() =>setFilled(!!props.value), [props.value])

	return (
		<div className={ focused ? styles.inputFocused : (filled ? styles.inputFilled : styles.input) } onClick={ inputFocus }>
			<label htmlFor='name'>{ props.label }</label>
			<input  ref={inputRef} name='name' type='text' defaultValue={ props.value } onBlur={ onBlur }></input>
		</div>
	)
}

const useFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }

	return [ htmlElRef, setFocus ] 
}

export default Input