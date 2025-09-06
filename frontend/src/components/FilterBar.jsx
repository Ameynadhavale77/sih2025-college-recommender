
import React from 'react'

export default function FilterBar({ filters, onFilterChange, onClearFilters }) {
  const locations = ["All", "Srinagar", "Jammu", "Anantnag", "Leh"]
  const courses = ["All", "B.Tech", "B.Sc", "BBA", "BA", "MBBS", "Diploma"]
  const budgets = ["All", "Low", "Medium", "High"]

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex flex-wrap gap-4 items-center">
        <h3 className="text-lg font-semibold text-gray-800 mr-4">Filters:</h3>
        
        {/* Location Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Location</label>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {locations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Course Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Course</label>
          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        {/* Budget Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Budget</label>
          <select
            value={filters.budget}
            onChange={(e) => onFilterChange('budget', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {budgets.map(budget => (
              <option key={budget} value={budget}>{budget}</option>
            ))}
          </select>
        </div>

        {/* Hostel Filter */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-600 mb-1">Hostel</label>
          <select
            value={filters.hostel}
            onChange={(e) => onFilterChange('hostel', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={onClearFilters}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300 self-end"
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
