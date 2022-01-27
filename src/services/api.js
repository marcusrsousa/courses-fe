import axios from 'axios'

const api = axios.create({
	baseURL: 'http://localhost:5000'
})

api.interceptors.request.use(request => {
	request.headers.Authorization = localStorage.getItem('Token')
	return request
})

api.interceptors.response.use(null, error => {
	if ([401, 403].includes(error.response.status)) {
		localStorage.removeItem('Token')
	}
	return Promise.reject(error)
})

export default api