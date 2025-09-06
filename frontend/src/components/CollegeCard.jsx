import React from 'react'

export default function CollegeCard({ college }) {
  const getCategoryColor = (category) => {
    const colors = {
      'engineering': 'bg-blue-100 text-blue-800',
      'medical': 'bg-red-100 text-red-800',
      'management': 'bg-green-100 text-green-800',
      'arts': 'bg-purple-100 text-purple-800',
      'general': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['general'];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-800 mb-2 flex-1">{college.name}</h3>
        {college.rank && (
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">
            <span className="mr-1">🏆</span>
            <span>NIRF #{college.rank}</span>
          </div>
        )}
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(college.category)}`}>
          {college.category ? college.category.charAt(0).toUpperCase() + college.category.slice(1) : 'General'}
        </span>
        {college.ownership && (
          <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs">
            {college.ownership}
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="mr-2">📍</span>
          <span className="text-sm">
            {college.location}
            {college.state && college.state !== college.location && `, ${college.state}`}
          </span>
        </div>
        
        {college.courses && college.courses.length > 0 && (
          <div className="flex items-center">
            <span className="mr-2">📚</span>
            <span className="text-sm">
              Courses: {college.courses.slice(0, 3).join(", ")}
              {college.courses.length > 3 && ` +${college.courses.length - 3} more`}
            </span>
          </div>
        )}
        
        <div className="flex items-center">
          <span className="mr-2">📈</span>
          <span className="text-sm">Cutoff: {college.cutoff}%</span>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2">🏠</span>
          <span className="text-sm">Hostel: {college.hostel ? "Available" : "Not Available"}</span>
        </div>
        
        <div className="flex items-center">
          <span className="mr-2">💰</span>
          <span className="text-sm">Budget: {college.budget}</span>
        </div>
        
        {college.established && (
          <div className="flex items-center">
            <span className="mr-2">📅</span>
            <span className="text-sm">Est. {college.established}</span>
          </div>
        )}
      </div>

      {college.score && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Match Score</span>
            <span className="text-sm font-bold text-gray-900">{college.score}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${college.score}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="flex gap-2">
        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition duration-300">
          View Details
        </button>
        {college.website && (
          <a 
            href={college.website} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-sm transition duration-300"
            title="Visit Website"
          >
            🌐
          </a>
        )}
      </div>
    </div>
  )
}