
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import CollegeCard from './CollegeCard'
import CollegeDetail from './CollegeDetail'
import FilterBar from './FilterBar'

export default function Result({ colleges }) {
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    location: 'All',
    course: 'All',
    budget: 'All',
    hostel: 'All'
  })

  const handleViewDetails = (college) => {
    setSelectedCollege(college)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCollege(null)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      location: 'All',
      course: 'All',
      budget: 'All',
      hostel: 'All'
    })
  }

  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      if (filters.location !== 'All' && college.location !== filters.location) return false
      if (filters.course !== 'All' && !college.courses.includes(filters.course)) return false
      if (filters.budget !== 'All' && college.budget !== filters.budget) return false
      if (filters.hostel !== 'All') {
        const hasHostel = college.hostel ? 'Available' : 'Not Available'
        if (hasHostel !== filters.hostel) return false
      }
      return true
    })
  }, [colleges, filters])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎯 Top College Recommendations
          </h1>
          <p className="text-lg text-gray-600">
            Based on your preferences, here are the best colleges for you
          </p>
        </div>

        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredColleges.map((college, index) => (
            <CollegeCard 
              key={college.name || index} 
              college={college} 
              onViewDetails={handleViewDetails}
            />
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

        <div className="text-center">
          <Link 
            to="/quiz" 
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 mr-4 hover:scale-105 transform"
          >
            🔄 Retake Quiz
          </Link>
          <Link 
            to="/" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:scale-105 transform"
          >
            🏠 Back Home
          </Link>
        </div>

        <CollegeDetail 
          college={selectedCollege}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  )
}
