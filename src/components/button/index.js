import React from 'react'
import MyRipple from '../ripple'

import styles from './Button.module.css'

export default function Button(props) {

	const { color, variant, size, children, onClick } = props
	

	const buttonColor = color ? styles[color] : styles.default
	const buttonVariant = variant ? styles[variant] : styles.none
	const buttonType = typeof(children) === 'string' ? styles.buttonText : styles.buttonIcon
	const click = () => setTimeout(() => onClick && onClick(), 1000)


	return (
		<MyRipple color={color} variant={variant}>
			<button className={`${buttonColor} ${buttonVariant} ${buttonType} ${styles[size ? size : 'normal']}`} onClick={click}>{children}</button>
		</MyRipple>
	)
}