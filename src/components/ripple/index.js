import React from 'react'
import { createRipples } from 'react-ripples'

export default function MyRipple(props) {
	const getColor = () => {
		if (props.variant === 'contained') {
			return 'rgba(255, 255, 255, .3)'
		}
        
		if(props.color === 'primary') {
			return 'rgba(25, 118, 210, .1)'
		}
    
		if(props.color === 'secondary') {
			return 'rgba(156, 39, 176, .1)'
		}
    
		if(props.color === 'success') {
			return 'rgba(46, 125, 50, .1)'
		}
    
		if(props.color === 'error') {
			return 'rgba(211, 47, 47, .1)'
		}
        
		return 'rgba(0, 0, 0, 0.1)'
		
	}
	const CustomRipple = createRipples({
		color: getColor(),
		during: 1000,
	})
	return (
		<CustomRipple>
			{props.children}
		</CustomRipple>
	)
}