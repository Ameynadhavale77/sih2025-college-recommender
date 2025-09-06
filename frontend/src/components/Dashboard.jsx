import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CollegeCard from './CollegeCard' // Assuming CollegeCard.jsx is in the same directory
import CollegeDetail from './CollegeDetail' // Assuming CollegeDetail.jsx is in the same directory
import FilterComponent from './FilterComponent' // Assuming FilterComponent.jsx is in the same directory

function Dashboard() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    location: '',
    course: '',
    budget: '',
    hostel: null, // true, false, or null for no filter
  })

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

    // Simulate API call delay
    setTimeout(() => {
      setColleges(collegeData)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtering logic
  const filteredColleges = colleges.filter((college) => {
    const locationMatch = filters.location === '' || college.location.toLowerCase() === filters.location.toLowerCase()
    const courseMatch = filters.course === '' || college.courses.some(course => course.toLowerCase() === filters.course.toLowerCase())
    const budgetMatch = filters.budget === '' || college.budget.toLowerCase() === filters.budget.toLowerCase()
    const hostelMatch = filters.hostel === null || college.hostel === filters.hostel
    return locationMatch && courseMatch && budgetMatch && hostelMatch
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({ location: '', course: '', budget: '', hostel: null })
  }

  const handleCollegeClick = (college) => {
    setSelectedCollege(college)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCollege(null)
  }

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

        {/* Filter Component */}
        <FilterComponent filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {filteredColleges.map((college, index) => (
            <div key={college.name || index} className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105 cursor-pointer" onClick={() => handleCollegeClick(college)}>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{college.name}</h3>
              <div className="mb-4">
                {college.courses.slice(0, 2).map((course, cIndex) => (
                  <span key={cIndex} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-1">
                    {course}
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-gray-600">
                <div>📍 Location: {college.location}</div>
                <div>📈 Cutoff: {college.cutoff}%</div>
                <div>💰 Budget: {college.budget}</div>
                <div>🏠 Hostel: {college.hostel ? 'Available' : 'Not Available'}</div>
                <div>⭐ Match Score: {college.score || 'N/A'}/100</div>
              </div>

              <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300" onClick={(e) => { e.stopPropagation(); handleCollegeClick(college); }}>
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredColleges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No colleges match your current filters.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        <CollegeDetail
          college={selectedCollege}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}

export default Dashboard