import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load college data (in real app, this would be an API call)
    const collegeData = [
      {
        "id": "c1",
        "name": "ABC Government College",
        "stream": "Science",
        "lat": 19.07,
        "lng": 72.87,
        "cutoff": 85,
        "facilities": ["Library", "Hostel"]
      },
      {
        "id": "c2",
        "name": "XYZ Government College",
        "stream": "Arts",
        "lat": 19.20,
        "lng": 72.85,
        "cutoff": 75,
        "facilities": ["Sports", "Cafeteria"]
      }
    ]
    
    setTimeout(() => {
      setColleges(collegeData)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading your recommendations...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            📊 Your College Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            Based on your preferences, here are the best colleges for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {colleges.map(college => (
            <div key={college.id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{college.name}</h3>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {college.stream}
                </span>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <div>📍 Location: {college.lat}, {college.lng}</div>
                <div>📈 Cutoff: {college.cutoff}%</div>
                <div>🏢 Facilities: {college.facilities.join(', ')}</div>
              </div>
              
              <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                View Details
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/quiz" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mr-4"
          >
            🔄 Retake Quiz
          </Link>
          <Link 
            to="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            🏠 Back Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard