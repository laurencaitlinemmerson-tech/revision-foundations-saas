'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight } from 'lucide-react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

interface SelfTestQuizProps {
  title?: string;
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export default function SelfTestQuiz({ 
  title = "Test Your Knowledge",
  questions,
  onComplete
}: SelfTestQuizProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    
    if (index === questions[currentQuestion].answer) {
      setScore(prev => prev + 1);
    }
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      onComplete?.(score + (selectedAnswer === questions[currentQuestion].answer ? 1 : 0), questions.length);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setAnsweredQuestions(new Set());
  };

  const getScoreEmoji = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return '🎉';
    if (percentage >= 60) return '👍';
    if (percentage >= 40) return '💪';
    return '📚';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'Excellent! You really know your stuff!';
    if (percentage >= 60) return 'Good job! Review the ones you missed.';
    if (percentage >= 40) return 'Getting there! Keep studying.';
    return 'Time to review! Read through the content again.';
  };

  return (
    <div className="mt-8 print:hidden">
      {/* Toggle Button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-full bg-gradient-to-r from-[var(--purple)] to-[var(--lavender)] text-white rounded-2xl p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-white/80 text-sm">{questions.length} quick questions to test yourself</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      )}

      {/* Quiz Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-[var(--lilac-soft)] to-[var(--pink-soft)]/30 rounded-2xl border border-[var(--lilac-medium)] overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display text-[var(--plum)]">{title}</h3>
                <button 
                  onClick={() => { setIsOpen(false); resetQuiz(); }}
                  className="text-sm text-[var(--plum-dark)]/60 hover:text-[var(--plum)] transition-colors"
                >
                  Close
                </button>
              </div>

              {!quizComplete ? (
                <>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-[var(--plum-dark)]/60 mb-2">
                      <span>Question {currentQuestion + 1} of {questions.length}</span>
                      <span className="font-semibold text-[var(--purple)]">Score: {score}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[var(--purple)] to-[var(--lavender)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-xl p-5 mb-4 shadow-sm"
                  >
                    <h4 className="text-lg font-semibold text-[var(--plum-dark)] mb-4">
                      {questions[currentQuestion].question}
                    </h4>

                    <div className="space-y-2">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            showResult
                              ? index === questions[currentQuestion].answer
                                ? 'bg-emerald-100 border-2 border-emerald-500'
                                : selectedAnswer === index
                                  ? 'bg-red-100 border-2 border-red-400'
                                  : 'bg-gray-50 border-2 border-transparent opacity-50'
                              : 'bg-[var(--lilac-soft)] border-2 border-transparent hover:border-[var(--lavender)] hover:bg-[var(--lilac)]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {showResult && index === questions[currentQuestion].answer && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            )}
                            {showResult && selectedAnswer === index && index !== questions[currentQuestion].answer && (
                              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            )}
                            <span className={`${
                              showResult && index === questions[currentQuestion].answer
                                ? 'text-emerald-800 font-medium'
                                : showResult && selectedAnswer === index
                                  ? 'text-red-800'
                                  : 'text-[var(--plum-dark)]'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Explanation */}
                    {showResult && questions[currentQuestion].explanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                      >
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">💡 </span>
                          {questions[currentQuestion].explanation}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Next Button */}
                  {showResult && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleNextQuestion}
                      className="btn-primary w-full"
                    >
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </motion.button>
                  )}
                </>
              ) : (
                /* Results */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="text-6xl mb-4">{getScoreEmoji()}</div>
                  <h4 className="text-2xl font-display text-[var(--plum-dark)] mb-2">Quiz Complete!</h4>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-amber-500" />
                    <span className="text-3xl font-bold text-[var(--purple)]">{score}/{questions.length}</span>
                  </div>
                  <p className="text-[var(--plum-dark)]/70 mb-6">{getScoreMessage()}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button onClick={resetQuiz} className="btn-secondary">
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                    <button 
                      onClick={() => { setIsOpen(false); resetQuiz(); }}
                      className="btn-primary"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
