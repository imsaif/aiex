import React, { useState, useEffect } from 'react';

// Define the types for our vocabulary words and questions
interface VocabularyWord {
  id: number;
  word: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  image?: string;
}

interface Question {
  id: number;
  type: 'translation' | 'multiple-choice' | 'fill-in-blank';
  prompt: string;
  correctAnswer: string;
  options?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

// Sample vocabulary database
const vocabularyDatabase: VocabularyWord[] = [
  { id: 1, word: 'perro', translation: 'dog', difficulty: 'easy' },
  { id: 2, word: 'gato', translation: 'cat', difficulty: 'easy' },
  { id: 3, word: 'casa', translation: 'house', difficulty: 'easy' },
  { id: 4, word: 'libro', translation: 'book', difficulty: 'easy' },
  { id: 5, word: 'escuela', translation: 'school', difficulty: 'medium' },
  { id: 6, word: 'ventana', translation: 'window', difficulty: 'medium' },
  { id: 7, word: 'ordenador', translation: 'computer', difficulty: 'medium' },
  { id: 8, word: 'amanecer', translation: 'sunrise', difficulty: 'hard' },
  { id: 9, word: 'desarrollador', translation: 'developer', difficulty: 'hard' },
  { id: 10, word: 'biblioteca', translation: 'library', difficulty: 'hard' },
];

// Sample questions based on vocabulary
const generateQuestions = (difficulty: 'easy' | 'medium' | 'hard'): Question[] => {
  const filteredWords = vocabularyDatabase.filter(word => word.difficulty === difficulty);
  
  return filteredWords.map(word => {
    // For simplicity, just create translation questions, but you could add other types
    const question: Question = {
      id: word.id,
      type: 'translation',
      prompt: `Translate "${word.word}" to English`,
      correctAnswer: word.translation,
      difficulty: word.difficulty
    };
    
    return question;
  });
};

export default function AdaptiveLearningDemo() {
  // User progress and state
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [currentDifficulty, setCurrentDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  
  // Initialize questions based on difficulty
  useEffect(() => {
    setQuestions(generateQuestions(currentDifficulty));
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
  }, [currentDifficulty]);

  // Current question
  const currentQuestion = questions[currentQuestionIndex] || null;

  // Check user answer
  const checkAnswer = () => {
    if (!currentQuestion) return;
    
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      
      // Adaptive difficulty: adjust based on consecutive correct answers
      if (adaptiveMode && newConsecutive >= 3) {
        if (currentDifficulty === 'easy') {
          setCurrentDifficulty('medium');
          setUserLevel('intermediate');
        } else if (currentDifficulty === 'medium') {
          setCurrentDifficulty('hard');
          setUserLevel('advanced');
        }
        setConsecutiveCorrect(0);
      }
    } else {
      // Reset consecutive correct counter when wrong
      setConsecutiveCorrect(0);
      
      // Adaptive difficulty: drop back down if struggling with harder content
      if (adaptiveMode && feedback === 'incorrect' && (currentQuestionIndex >= questions.length - 1)) {
        if (currentDifficulty === 'hard') {
          setCurrentDifficulty('medium');
          setUserLevel('intermediate');
        } else if (currentDifficulty === 'medium') {
          setCurrentDifficulty('easy');
          setUserLevel('beginner');
        }
      }
    }
  };

  // Go to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // End of questions set, reset or generate new questions
      setCurrentQuestionIndex(0);
    }
    
    setUserAnswer('');
    setFeedback(null);
  };

  // Toggle adaptive mode
  const toggleAdaptiveMode = () => {
    setAdaptiveMode(!adaptiveMode);
    
    // Reset to beginner if turning adaptive mode back on
    if (!adaptiveMode) {
      setCurrentDifficulty('easy');
      setUserLevel('beginner');
      setConsecutiveCorrect(0);
    }
  };

  // Manually change difficulty (only available when adaptive mode is off)
  const changeDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
    setCurrentDifficulty(difficulty);
    setUserLevel(
      difficulty === 'easy' ? 'beginner' : 
      difficulty === 'medium' ? 'intermediate' : 'advanced'
    );
    setConsecutiveCorrect(0);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header with level and settings */}
      <div className="bg-green-500 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Adaptive Spanish Learning</h2>
          <div className="text-sm flex items-center">
            <span className="mr-2">Level: {userLevel}</span>
            <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
              {currentDifficulty.toUpperCase()}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)} 
          className="rounded-full bg-white bg-opacity-20 p-2 hover:bg-opacity-30 active:scale-95 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Settings panel (toggled) */}
      {showSettings && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Settings</h3>
          
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="adaptive-mode" className="text-sm text-gray-600">
              Adaptive Mode (adjusts to your performance)
            </label>
            <label htmlFor="adaptive-mode" className="relative inline-block w-10 mr-2 align-middle select-none cursor-pointer">
              <input
                type="checkbox"
                id="adaptive-mode"
                className="sr-only"
                checked={adaptiveMode}
                onChange={toggleAdaptiveMode}
              />
              <div className={`block h-6 rounded-full w-10 ${adaptiveMode ? 'bg-green-400' : 'bg-gray-300'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${adaptiveMode ? 'translate-x-4' : ''}`}></div>
            </label>
          </div>
          
          {!adaptiveMode && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Set difficulty manually:</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => changeDifficulty('easy')} 
                  className={`px-3 py-1 rounded text-xs font-medium active:scale-95 transition-all ${currentDifficulty === 'easy' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Easy
                </button>
                <button
                  onClick={() => changeDifficulty('medium')}
                  className={`px-3 py-1 rounded text-xs font-medium active:scale-95 transition-all ${currentDifficulty === 'medium' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => changeDifficulty('hard')}
                  className={`px-3 py-1 rounded text-xs font-medium active:scale-95 transition-all ${currentDifficulty === 'hard' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  Hard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current question */}
      {currentQuestion && (
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-500 text-sm mb-1">Translate to English</p>
            <h3 className="text-xl font-bold text-gray-800">{currentQuestion.prompt}</h3>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={feedback !== null}
            />
          </div>
          
          {/* Feedback */}
          {feedback && (
            <div className={`p-3 mb-4 rounded-md ${feedback === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback === 'correct' ? (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p>Correct! Great job.</p>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>Incorrect.</p>
                    <p className="text-sm">The correct answer is: {currentQuestion.correctAnswer}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex justify-between">
            {!feedback ? (
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className={`w-full py-3 rounded-md font-medium transition-all ${
                  userAnswer.trim()
                    ? 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Check
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full py-3 rounded-md font-medium bg-green-500 text-white hover:bg-green-600 active:scale-95 transition-all"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="px-6 pb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        {/* Adaptive mode indicator */}
        {adaptiveMode && consecutiveCorrect > 0 && (
          <div className="mt-2 text-xs text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            <span>
              {consecutiveCorrect}/3 correct in a row
              {consecutiveCorrect === 2 && currentDifficulty !== 'hard' && " - one more for next level!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 