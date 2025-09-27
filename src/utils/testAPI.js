// Test API connectivity
const testAPI = async () => {
  try {
    const response = await fetch('https://hotel-backend-wh9t.onrender.com/api/auth/test')
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