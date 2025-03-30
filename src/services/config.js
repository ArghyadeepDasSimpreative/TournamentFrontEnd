import axios from 'axios'

// Base URL for the backend server
const BASE_URL = 'http://localhost:3000'

// Public Axios instance (for requests that don't need authentication)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Private Axios instance (for authenticated requests)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
  },
})

// Function to update the Authorization token dynamically
export const setAuthToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    axiosPrivate.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axiosPrivate.defaults.headers.common['Authorization']
  }
}
