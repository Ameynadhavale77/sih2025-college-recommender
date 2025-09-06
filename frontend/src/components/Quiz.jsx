import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../api/recommender'
import { getStreamRecommendations } from '../api/streamRecommender'
import Result from './Result'

function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [streamRecommendations, setStreamRecommendations] = useState([])
  const [topStream, setTopStream] = useState(null)
  const [topColleges, setTopColleges] = useState([])
  const [showStreamResults, setShowStreamResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Load quiz questions from JSON file
    async function loadQuiz() {
      try {
        const response = await fetch('/quiz.json')
        const quizData = await response.json()
        setQuestions(quizData)
      } catch (error) {
        console.error('Error loading quiz:', error)
        // Fallback questions if file load fails
        setQuestions([])
      }
    }
    loadQuiz()
  }, [])

  const handleProceedToColleges = async () => {
    setLoading(true)
    try {
      const result = await getRecommendations(answers)
      setTopColleges(result.colleges)
      setShowStreamResults(false)
      localStorage.setItem('collegeRecommendations', JSON.stringify(result))
    } catch (error) {
      console.error('Error getting college recommendations:', error)
    }
    setLoading(false)
  }

  const handleAnswer = async (selectedOption) => {
    const newAnswers = { ...answers }
    const questionId = questions[currentQuestion].id
    newAnswers[questionId] = selectedOption
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed - first show stream recommendations
      setLoading(true)
      try {
        const streamRecs = getStreamRecommendations(newAnswers)
        setStreamRecommendations(streamRecs)
        setTopStream(streamRecs[0])
        setShowStreamResults(true)
        localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
        localStorage.setItem('streamRecommendations', JSON.stringify(streamRecs))
      } catch (error) {
        console.error('Error getting stream recommendations:', error)
      }
      setLoading(false)
    }
  }

  // Show college results if we have them
  if (topColleges.length > 0) {
    return <Result colleges={topColleges} streamRecommendations={streamRecommendations} topStream={topStream} />
  }
  
  // Show stream recommendations first
  if (showStreamResults) {
    return <StreamRecommendationDisplay 
      streamRecommendations={streamRecommendations} 
      topStream={topStream}
      answers={answers}
      onProceed={handleProceedToColleges}
    />
  }

  // Show loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">🔄 Finding your perfect colleges...</div>
    </div>
  }

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading quiz...</div>
    </div>
  }

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full transition-all duration-300" style={{width: `${progress}%`}}></div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.text}</h2>
            
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-purple-100 border border-gray-200 rounded-lg transition duration-300"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stream Recommendation Display Component
function StreamRecommendationDisplay({ streamRecommendations, topStream, answers, onProceed }) {
  const [showAllStreams, setShowAllStreams] = useState(false)
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🎯 Your Perfect Stream Match!</h1>
            <p className="text-lg text-gray-600">Based on your academic capabilities and interests</p>
          </div>

          {/* Top Stream Recommendation */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <span className="text-2xl">🏆</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Best Match: {topStream.stream}</h2>
                <div className="flex items-center mt-1">
                  <span className="text-lg text-green-600 font-semibold">{topStream.percentage}% Match</span>
                  <div className="ml-4 w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: `${topStream.percentage}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{topStream.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">🎓 Top Courses for You:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {topStream.topCourses.slice(0, 3).map((course, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">💼 Career Opportunities:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {topStream.careers.slice(0, 3).map((career, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      {career}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Other Stream Options */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Other Suitable Streams</h3>
              <button 
                onClick={() => setShowAllStreams(!showAllStreams)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showAllStreams ? 'Show Less' : 'Show All'}
              </button>
            </div>
            
            <div className="space-y-4">
              {streamRecommendations.slice(1, showAllStreams ? 5 : 3).map((stream, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-800">{stream.stream}</h4>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{stream.percentage}% Match</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${stream.percentage}%`}}></div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{stream.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={onProceed}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition duration-300 shadow-lg"
            >
              🎓 Find Perfect Colleges for {topStream.stream} →
            </button>
            <p className="text-sm text-gray-600 mt-2">Get personalized college recommendations</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Quiz