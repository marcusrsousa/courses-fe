import React from 'react'
import MyRipple from '../ripple'

import styles from './Button.module.css'

export default function Button(props) {
	

	const buttonColor = props.color ? styles[props.color] : styles.default
	const buttonVariant = props.variant ? styles[props.variant] : styles.none
	const buttonType = typeof(props.children) === 'string' ? styles.buttonText : styles.buttonIcon
	const onClick = () => setTimeout(() => props.onClick && props.onClick(), 1000)

	return (
		<MyRipple color={props.color} variant={props.variant}>
			<button className={`${buttonColor} ${buttonVariant} ${buttonType}`} onClick={onClick}>{props.children}</button>
		</MyRipple>
	)
}