import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load enhanced JK college data with scoring
    const collegeData = [
      {"name":"University of Kashmir","location":"Srinagar","courses":["B.Sc","BA","B.Tech"],"cutoff":70,"hostel":true,"budget":"Medium","score":85},
      {"name":"GC Jammu","location":"Jammu","courses":["BBA","BA","B.Sc"],"cutoff":65,"hostel":false,"budget":"Low","score":75},
      {"name":"NIT Srinagar","location":"Srinagar","courses":["B.Tech"],"cutoff":80,"hostel":true,"budget":"High","score":95},
      {"name":"University of Jammu","location":"Jammu","courses":["B.Tech","B.Sc","BBA"],"cutoff":75,"hostel":true,"budget":"Medium","score":80},
      {"name":"Government Medical College Jammu","location":"Jammu","courses":["MBBS"],"cutoff":90,"hostel":true,"budget":"Low","score":90},
      {"name":"Cluster University Srinagar","location":"Srinagar","courses":["BA","BBA","Diploma"],"cutoff":60,"hostel":false,"budget":"Low","score":70}
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
          {colleges.map((college, index) => (
            <div key={college.name || index} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{college.name}</h3>
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {college.stream}
                </span>
              </div>
              
              <div className="space-y-2 text-gray-600">
                <div>📍 Location: {college.location}</div>
                <div>📈 Cutoff: {college.cutoff}%</div>
                <div>💰 Budget: {college.budget}</div>
                <div>🏠 Hostel: {college.hostel ? 'Available' : 'Not Available'}</div>
                <div>📚 Courses: {college.courses.join(', ')}</div>
                <div>⭐ Match Score: {college.score || 'N/A'}/100</div>
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