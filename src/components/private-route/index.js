import React from 'react'

import Login from '../login'

function PrivateRoute({ children }) {
	if(!localStorage.getItem('Token')) {
		return <Login />
	}

	return children
	
}

export default PrivateRoute