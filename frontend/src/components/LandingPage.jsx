import React from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            🎓 College Recommender
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find the perfect college for your academic journey. Take our personalized quiz 
            to discover colleges that match your interests and academic goals.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Personalized Matching</h3>
            <p className="text-gray-600">
              Our intelligent quiz analyzes your preferences to find colleges that align with your interests.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Data-Driven Results</h3>
            <p className="text-gray-600">
              Get recommendations based on cutoff scores, facilities, and academic streams.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold mb-2">Location-Based</h3>
            <p className="text-gray-600">
              Find colleges near you with detailed location information and facilities.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link 
            to="/quiz" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 inline-block mr-4"
          >
            🚀 Start Quiz
          </Link>
          <Link 
            to="/dashboard" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 inline-block"
          >
            📈 View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage