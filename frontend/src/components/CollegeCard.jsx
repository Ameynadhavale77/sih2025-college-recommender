import React from 'react'

export default function CollegeCard({ college }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{college.name}</h3>
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
          {college.stream || 'General'}
        </span>
      </div>
      
      <div className="space-y-2 text-gray-600">
        <div className="flex items-center">
          <span className="mr-2">📍</span>
          <span>Location: {college.location}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">📚</span>
          <span>Courses: {college.courses.join(", ")}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">📈</span>
          <span>Cutoff: {college.cutoff}%</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">🏠</span>
          <span>Hostel: {college.hostel ? "Available" : "Not Available"}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-2">💰</span>
          <span>Budget: {college.budget}</span>
        </div>
        {college.score && (
          <div className="flex items-center">
            <span className="mr-2">⭐</span>
            <span>Match Score: {college.score}/100</span>
          </div>
        )}
      </div>
      
      <button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
        View Details
      </button>
    </div>
  )
}