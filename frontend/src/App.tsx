import axios from "axios"
import { useEffect, useState } from "react"


function App() {
const [res, setRes] = useState(null)
const [loading, setLoading] = useState(false)
useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get("http://localhost:3000/")
      const data = response.data
      setRes(data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [])
  return (
    <>
      <div className="bg-red-500">akash ms lord</div>
      
      {loading && (<div>Loading...</div>)}
      <div>{res}</div>

    </>
  )
}

export default App
