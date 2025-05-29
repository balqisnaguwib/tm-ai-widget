"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitSurveyAnswer } from "@/lib/api";
import { storage } from "@/lib/utils";
import Image from "next/image";

// Survey questions and options
const questions = [
  {
    question: "Which of the following best describes AI?",
    options: [
      "A. Computers performing tasks that require human intelligence",
      "B. Automating routine office tasks using macros",
      "C. Networking devices for faster internet",
      "D. A code that sorts data alphabetically"
    ]
  },
  {
    question: "Which of these is NOT an example of AI in daily life?",
    options: [
      "A. Email app suggesting replies based on message content",
      "B. Image enhancement feature in a smartphone camera",
      "C. Automatic screen brightness adjustment on a mobile device",
      "D. E-commerce website recommending products based on past browsing behavior"
    ]
  },
  {
    question: "Which factor poses the greatest challenge to ensuring fairness in an AI-based job screening application?",
    options: [
      "A. Differences in applicant Internet connectivity during the application process",
      "B. The choice of programming language used to build the AI model",
      "C. Implicit biases present in historical hiring data used for model training",
      "D. The speed at which applications are processed by the underlying server hardware"
    ]
  },
  {
    question: "What is the main difference between Supervised and Unsupervised Learning?",
    options: [
      "A. Supervised uses labeled data; unsupervised uses unlabeled data",
      "B. Supervised is faster than unsupervised",
      "C. Unsupervised has fewer errors than supervised",
      "D. There is no difference"
    ]
  },
  {
    question: "For generative language models like GPT, which limitation is MOST relevant?",
    options: [
      "A. They can only perform binary classification tasks.",
      "B. They may produce text that is plausible but factually inaccurate.",
      "C. They require labeled output for every input sequence.",
      "D. They have no dependence on the size of training data."
    ]
  }
];

export default function SurveyForm() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [surveyComplete, setSurveyComplete] = useState(false);
  const [surveyResult, setsurveyResult] = useState<{level?: string; score?: string | number} | null>(null);
  
  const user = storage.getUser();
  
  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      router.push("/chat/login");
      return;
    }
    
    // Check if we have existing survey state
    const savedAnswers = storage.getSurveyState();
    if (savedAnswers && savedAnswers.length > 0) {
      setAnswers(savedAnswers);
      
      // If survey is already complete, skip to chat
      if (savedAnswers.length === questions.length) {
        router.push("/chat/main");
      } else {
        setCurrentQuestionIndex(savedAnswers.length);
      }
    }
  }, [router, user]);
  
  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };
  
  const handleNext = async () => {
    if (!selectedOption) return;
    
    const optionIndex = questions[currentQuestionIndex].options.indexOf(selectedOption);
    if (optionIndex === -1) return;
    
    // Convert option index to letter (0 -> 'a', 1 -> 'b', etc.)
    const answerLetter = String.fromCharCode(97 + optionIndex);
    const newAnswers = [...answers, answerLetter];
    
    setAnswers(newAnswers);
    storage.setSurveyState(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      // Survey complete, submit answers
      setIsLoading(true);
      
      try {
        const response = await submitSurveyAnswer(user.tm_id, newAnswers);
        
        if (response.status === "success") {
          setSurveyComplete(true);
          setsurveyResult({
            level: response.level,
            score: response.score
          });
          
          // Wait 3 seconds before redirecting to chat
          setTimeout(() => {
            router.push("/chat/main");
          }, 3000);
        } else {
          setError(response.message || "Failed to submit survey. Please try again.");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        console.error("Survey submission error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  
  if (surveyComplete) {
    return (
      <div className="glass-effect rounded-2xl p-8 shadow-lg text-center">
        <div className="mb-6">
          <div className="inline-block rounded-full bg-green-100 p-3">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Survey Complete!</h2>
        <p className="mb-4">Thank you for completing the AI competency survey.</p>
        
        {surveyResult && (
          <div className="mb-6">
            <p className="text-lg font-medium">Your AI competency level:</p>
            <p className="text-xl font-bold text-tm-blue">{surveyResult.level}</p>
            {surveyResult.score && (
              <p className="text-sm text-gray-600">Score: {surveyResult.score}/5</p>
            )}
          </div>
        )}
        
        <p className="text-sm text-gray-600">Redirecting to chat...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-center mb-8">
        <Image 
          src="/tm-logo.png" 
          alt="TM Logo" 
          width={150} 
          height={60}
        />
      </div>
      
      <div className="glass-effect rounded-2xl p-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-tm-blue to-tm-orange bg-clip-text text-transparent">
            AI Competency Survey
          </h2>
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                  selectedOption === option
                    ? "bg-tm-blue text-white shadow-md"
                    : "bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/80"
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedOption || isLoading}
            className={`py-3 px-6 bg-gradient-to-r from-tm-blue to-tm-orange text-white font-medium rounded-xl shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
              !selectedOption || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-tm-blue to-tm-orange h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}