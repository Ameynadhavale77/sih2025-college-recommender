import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    // Load quiz data (in real app, this would be an API call)
    const quizData = {
      "questions": [
        {
          "id": 1,
          "text": "Do you enjoy solving math problems?",
          "options": [
            {"text": "Yes", "weights": {"science": 2, "commerce": 1}},
            {"text": "No", "weights": {"arts": 2}}
          ]
        },
        {
          "id": 2,
          "text": "Do you like reading literature?",
          "options": [
            {"text": "Yes", "weights": {"arts": 2}},
            {"text": "No", "weights": {"science": 1}}
          ]
        }
      ]
    }
    setQuestions(quizData.questions)
  }, [])

  const handleAnswer = (optionIndex) => {
    const newAnswers = { ...answers }
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Quiz completed - calculate results and navigate to dashboard
      localStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
      navigate('/dashboard')
    }
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
                  onClick={() => handleAnswer(index)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-purple-100 border border-gray-200 rounded-lg transition duration-300"
                >
                  {option.text}
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