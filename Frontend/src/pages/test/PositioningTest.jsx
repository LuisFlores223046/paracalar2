import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileService } from '../../services/profile.service'
import { toast } from 'react-toastify'

const QUESTIONS = [
  {
    id: 'fitness_objective',
    question: 'What is your primary fitness goal?',
    options: [
      { value: 'muscle_gain', label: 'Build Muscle' },
      { value: 'weight_loss', label: 'Lose Weight' },
      { value: 'endurance', label: 'Improve Endurance' },
      { value: 'general_fitness', label: 'General Fitness' },
    ],
  },
  {
    id: 'physical_activity',
    question: 'What type of physical activity do you primarily engage in?',
    options: [
      { value: 'weightlifting', label: 'Weightlifting' },
      { value: 'running', label: 'Running' },
      { value: 'cycling', label: 'Cycling' },
      { value: 'yoga', label: 'Yoga' },
      { value: 'crossfit', label: 'CrossFit' },
    ],
  },
  {
    id: 'dietary_preference',
    question: 'Do you have any dietary preferences or restrictions?',
    options: [
      { value: 'none', label: 'No restrictions' },
      { value: 'vegetarian', label: 'Vegetarian' },
      { value: 'vegan', label: 'Vegan' },
      { value: 'gluten_free', label: 'Gluten-Free' },
      { value: 'lactose_free', label: 'Lactose-Free' },
    ],
  },
]

export default function PositioningTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value })

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await profileService.updateFitnessProfile(answers)
      toast.success('Your profile has been updated!')
      navigate('/products')
    } catch (error) {
      toast.error('Failed to save your responses')
    } finally {
      setLoading(false)
    }
  }

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
      <div className="container-custom max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Positioning Test</h1>
          <p className="text-gray-600">
            Answer a few questions to get personalized product recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
        </div>

        {/* Question Card */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(question.id, option.value)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                  answers[question.id] === option.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              className="btn btn-outline"
              disabled={currentQuestion === 0}
            >
              Back
            </button>

            {currentQuestion === QUESTIONS.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading || !answers[question.id]}
              >
                {loading ? 'Submitting...' : 'Complete Test'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="btn btn-primary"
                disabled={!answers[question.id]}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
