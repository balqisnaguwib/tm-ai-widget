import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle, Loader, Brain } from 'lucide-react';
import { UserData } from './ChatWidget';

interface SurveyFormProps {
  userData: UserData;
  onComplete: (level: string, score: number, welcomeMessage: string) => void;
  isMaximized?: boolean;
}

const surveyQuestions = [
  {
    question: "Hi there! 👋 Welcome to AI Day at TM. Before we dive in, I'd love to understand your knowledge of AI a bit better. Here's my first question for you:\n\nWhich of the following best describes AI?",
    options: [
      "A. Computers performing tasks that require human intelligence",
      "B. Automating routine office tasks using macros",
      "C. Networking devices for faster internet",
      "D. A code that sorts data alphabetically"
    ],
    correct: "a"
  },
  {
    question: "Which of these is NOT an example of AI in daily life?",
    options: [
      "A. Email app suggesting replies based on message content",
      "B. Image enhancement feature in a smartphone camera",
      "C. Automatic screen brightness adjustment on a mobile device",
      "D. E-commerce website recommending products based on past browsing behavior"
    ],
    correct: "c"
  },
  {
    question: "Which factor poses the greatest challenge to ensuring fairness in an AI-based job screening application?",
    options: [
      "A. Differences in applicant Internet connectivity during the application process",
      "B. The choice of programming language used to build the AI model",
      "C. Implicit biases present in historical hiring data used for model training",
      "D. The speed at which applications are processed by the underlying server hardware"
    ],
    correct: "c"
  },
  {
    question: "What is the main difference between Supervised and Unsupervised Learning?",
    options: [
      "A. Supervised uses labeled data; unsupervised uses unlabeled data",
      "B. Supervised is faster than unsupervised",
      "C. Unsupervised has fewer errors than supervised",
      "D. There is no difference"
    ],
    correct: "a"
  },
  {
    question: "For generative language models like GPT, which limitation is MOST relevant?",
    options: [
      "A. They can only perform binary classification tasks.",
      "B. They may produce text that is plausible but factually inaccurate.",
      "C. They require labeled output for every input sequence.",
      "D. They have no dependence on the size of training data."
    ],
    correct: "b"
  }
];

export default function SurveyForm({ userData, onComplete, isMaximized = false }: SurveyFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      // Survey complete, submit to backend
      await submitSurvey(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
      // Remove the last answer
      setAnswers(answers.slice(0, -1));
    }
  };

  const submitSurvey = async (finalAnswers: string[]) => {
    setIsLoading(true);
    setError('');

    try {
      const { submitSurvey, handleApiError } = await import('../utils/api');
      const result = await submitSurvey({
        tm_id: userData.tm_id,
        answers: finalAnswers,
      });

      if (result.status === 'success' && result.level && typeof result.score === 'number') {
        onComplete(result.level, result.score, result.message || 'Survey completed successfully!');
      } else {
        setError(result.message || 'Survey submission failed. Please try again.');
      }
    } catch (err) {
      const { handleApiError } = await import('../utils/api');
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  // Adjust container height based on maximize state
  const containerClass = isMaximized 
    ? "p-6 h-full max-h-[calc(100vh-4rem)] overflow-y-auto"
    : "p-6 h-full max-h-[calc(100vh-12rem)] overflow-y-auto";

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-16 h-16 mx-auto tm-gradient rounded-full flex items-center justify-center mb-4"
          >
            <Brain className="text-white" size={24} />
          </motion.div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            AI Competency Assessment
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {surveyQuestions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="tm-gradient h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl mb-4">
              <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-line">
                {surveyQuestions[currentQuestion].question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {surveyQuestions[currentQuestion].options.map((option, index) => {
                const optionLetter = String.fromCharCode(97 + index); // a, b, c, d
                const isSelected = selectedAnswer === optionLetter;
                
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswerSelect(optionLetter)}
                    className={`
                      w-full p-4 rounded-xl text-left
                      border-2 ios-transition
                      ${isSelected 
                        ? 'border-tm-blue bg-tm-blue/10 text-tm-blue dark:text-tm-blue-light' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-tm-blue/50 text-gray-700 dark:text-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center
                        ${isSelected ? 'border-tm-blue bg-tm-blue' : 'border-gray-300 dark:border-gray-600'}
                      `}>
                        {isSelected && <CheckCircle className="text-white" size={16} />}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl
              ${currentQuestion === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-tm-blue hover:bg-tm-blue/10'
              }
              ios-transition
            `}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!selectedAnswer || isLoading}
            className={`
              flex items-center space-x-2 px-6 py-2 rounded-xl font-medium
              ${!selectedAnswer || isLoading
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'tm-gradient text-white hover:shadow-lg'
              }
              ios-transition
            `}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>
                  {currentQuestion === surveyQuestions.length - 1 ? 'Complete' : 'Next'}
                </span>
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}