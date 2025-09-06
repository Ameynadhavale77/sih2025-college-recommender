import React from 'react'
import { Link } from 'react-router-dom'
import CollegeCard from './CollegeCard'

export default function Result({ colleges }) {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {colleges.map((college, index) => (
            <CollegeCard key={college.name || index} college={college} />
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