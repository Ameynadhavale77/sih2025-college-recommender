
import React from 'react'

export default function CollegeDetail({ college, isOpen, onClose }) {
  if (!isOpen || !college) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-90vh overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{college.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="mr-3 text-lg">📍</span>
              <span className="text-gray-700"><strong>Location:</strong> {college.location}</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-3 text-lg">📚</span>
              <span className="text-gray-700"><strong>Courses:</strong> {college.courses.join(", ")}</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-3 text-lg">📈</span>
              <span className="text-gray-700"><strong>Cutoff:</strong> {college.cutoff}%</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-3 text-lg">🏠</span>
              <span className="text-gray-700"><strong>Hostel:</strong> {college.hostel ? "Available" : "Not Available"}</span>
            </div>
            
            <div className="flex items-center">
              <span className="mr-3 text-lg">💰</span>
              <span className="text-gray-700"><strong>Budget:</strong> {college.budget}</span>
            </div>
            
            {college.score && (
              <div className="flex items-center">
                <span className="mr-3 text-lg">⭐</span>
                <span className="text-gray-700"><strong>Match Score:</strong> {college.score}/100</span>
              </div>
            )}

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">About {college.name}</h3>
              <p className="text-gray-600">
                {college.name} is located in {college.location} and offers courses in {college.courses.join(", ")}. 
                The admission cutoff is {college.cutoff}% and the college has a {college.budget.toLowerCase()} budget range.
                {college.hostel ? " Hostel facilities are available." : " Hostel facilities are not available."}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mt-6">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                🌐 Visit Website
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                📞 Contact Info
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
