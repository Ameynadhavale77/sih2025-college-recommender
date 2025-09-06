import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../api/recommender'
import Result from './Result'

function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [topColleges, setTopColleges] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Load enhanced quiz data with expanded nationwide options
    const quizData = [
      {
        "id": 1,
        "text": "Which academic stream do you prefer?",
        "type": "single",
        "options": ["Engineering", "Medical", "Science", "Commerce", "Management", "Arts"],
        "score": {"Engineering": 3, "Medical": 3, "Science": 3, "Commerce": 2, "Management": 2, "Arts": 1}
      },
      {
        "id": 2,
        "text": "Preferred course type?",
        "type": "single",
        "options": ["B.Tech", "MBBS", "B.Sc", "BBA", "MBA", "BA", "Diploma"],
        "score": {"B.Tech": 3, "MBBS": 3, "B.Sc": 2, "BBA": 2, "MBA": 3, "BA": 1, "Diploma": 1}
      },
      {
        "id": 3,
        "text": "Location preference?",
        "type": "single",
        "options": ["Jammu and Kashmir", "Delhi", "Mumbai", "Bangalore", "Chennai", "Pune", "Hyderabad", "Anywhere in India"],
        "score": {"Jammu and Kashmir": 3, "Delhi": 3, "Mumbai": 3, "Bangalore": 3, "Chennai": 2, "Pune": 2, "Hyderabad": 2, "Anywhere in India": 2}
      },
      {
        "id": 4,
        "text": "Interest in practical labs / hands-on work?",
        "type": "single",
        "options": ["High", "Medium", "Low"],
        "score": {"High": 3, "Medium": 2, "Low": 1}
      }
    ]
    setQuestions(quizData)
  }, [])

  const handleAnswer = async (selectedOption) => {
    const newAnswers = { ...answers }
    const questionId = questions[currentQuestion].id
    newAnswers[questionId] = selectedOption
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed - get recommendations
      setLoading(true)
      try {
        const recommendations = await getRecommendations(newAnswers)
        setTopColleges(recommendations)
        localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
        localStorage.setItem('recommendations', JSON.stringify(recommendations))
      } catch (error) {
        console.error('Error getting recommendations:', error)
      }
      setLoading(false)
    }
  }

  // Show results if we have recommendations
  if (topColleges.length > 0) {
    return <Result colleges={topColleges} />
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

export default Quiz