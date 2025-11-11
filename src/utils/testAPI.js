// Test API connectivity
const testAPI = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://hotel-backend-e4cv.onrender.com/api'
    const response = await fetch(`${apiUrl}/auth/test`)
    console.log('API Test Response:', response.status)
    const data = await response.json()
    console.log('API Test Data:', data)
  } catch (error) {
    console.error('API Test Error:', error)
  }
}

// Test on page load
testAPI()

export default testAPI