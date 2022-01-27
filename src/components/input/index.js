import React, { useEffect, useRef, useState } from 'react'
import styles from './Input.module.css'

function Input(props) {
	const [focused, setFocused] = useState(false)
	const [filled, setFilled] = useState(false)
	const [inputRef, setInputFocus] = useFocus()
	const [color, setColor] = useState(props.color)

	useEffect(() => {
		if(props.submitted && props.required && !props.value) {
			setFocused(true)  
			setColor('error')
			setFilled(true) 
		}
	}, [props.submitted])
	
	const onBlur = (e) => {
		props.onChange(e.target.value)
		if(props.required && !e.target.value) {
			setColor('error')
			setFilled(true) 
			return
		}

		setFocused(false)
		setFilled(!!e.target.value) 
	}

	const inputFocus = () => {
		setFocused(true)  
		setInputFocus()      
	}

	useEffect(() =>setFilled(!!props.value), [props.value])

	const inputStyle = `${focused ? styles.inputFocused : (filled ? styles.inputFilled : styles.input)} ${styles[color ? color : 'default']}`

	return (
		<>
			<div className={ inputStyle } onClick={ inputFocus }>
				<label htmlFor='name'>{ props.label }{ props.required && '*' }</label>
				<input  ref={inputRef} name='name' type={props.type ? props.type : 'text'} defaultValue={ props.value } onKeyUp={e => e.target.value && setColor(props.color)} onFocus={() => setFocused(true)} onBlur={ onBlur }></input>
			</div>
			{ props.required && color === 'error' && <span className={  styles[color ? color : 'default'] }>{props.label} is required</span>}
		</>
	)
}

const useFocus = () => {
	const htmlElRef = useRef(null)
	const setFocus = () => { htmlElRef.current && htmlElRef.current.focus() }

	return [ htmlElRef, setFocus ] 
}

export { Input, useFocus }