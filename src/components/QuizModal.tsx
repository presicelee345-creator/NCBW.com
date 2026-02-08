import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  duration: string;
  onComplete: (score: number) => void;
}

// Sample quiz questions - in a real app, these would be fetched from a database
const generateQuizQuestions = (quizTitle: string): Question[] => {
  return [
    {
      question: "What is the primary purpose of strategic visioning in leadership?",
      options: [
        "To create a long-term roadmap and inspire organizational direction",
        "To focus only on short-term goals",
        "To avoid making difficult decisions",
        "To maintain the status quo",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which leadership style is most effective for fostering innovation and team empowerment?",
      options: [
        "Autocratic leadership",
        "Transformational leadership",
        "Laissez-faire with no guidance",
        "Micromanagement",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is essential for successful strategic planning?",
      options: [
        "Ignoring team input",
        "Clear goals, stakeholder engagement, and measurable outcomes",
        "Making decisions in isolation",
        "Avoiding accountability",
      ],
      correctAnswer: 1,
    },
    {
      question: "How should a leader approach organizational change?",
      options: [
        "Resist and avoid it",
        "Implement without communication",
        "Communicate clearly, involve stakeholders, and provide support",
        "Force rapid changes without planning",
      ],
      correctAnswer: 2,
    },
    {
      question: "What contributes most to effective leadership vision?",
      options: [
        "Personal gain and individual success",
        "Alignment with organizational values, mission, and stakeholder needs",
        "Following trends without analysis",
        "Avoiding risk entirely",
      ],
      correctAnswer: 1,
    },
  ];
};

export function QuizModal({ isOpen, onClose, quizTitle, duration, onComplete }: QuizModalProps) {
  const questions = generateQuizQuestions(quizTitle);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  // Reset start time when quiz opens
  useEffect(() => {
    if (isOpen) {
      setStartTime(Date.now());
    }
  }, [isOpen]);

  const handleAnswerSelect = (answerIndex: number) => {
    // Only allow answer selection if this question hasn't been locked
    if (!answeredQuestions.has(currentQuestion)) {
      const newAnswers = [...selectedAnswers];
      newAnswers[currentQuestion] = answerIndex;
      setSelectedAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    // Lock the current question when clicking next
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSubmit = () => {
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000); // in seconds
    setCompletionTime(timeTaken);
    setIsSubmitted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    const correct = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const handleClose = () => {
    if (showResults) {
      const score = calculateScore();
      onComplete(score.percentage);
    }
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    setShowResults(false);
    setStartTime(Date.now());
    setCompletionTime(0);
    setAnsweredQuestions(new Set());
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = selectedAnswers.length === questions.length && 
    selectedAnswers.every((answer) => answer !== undefined);
  const currentQuestionAnswered = selectedAnswers[currentQuestion] !== undefined;
  const isCurrentQuestionLocked = answeredQuestions.has(currentQuestion);

  const score = calculateScore();
  const passed = score.percentage >= 70;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#c6930a]">{quizTitle}</DialogTitle>
          <DialogDescription>
            Duration: {duration} • {questions.length} Questions • Passing Score: 70%
          </DialogDescription>
        </DialogHeader>

        {!showResults ? (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Question {currentQuestion + 1} of {questions.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="py-4">
                <h3 className="mb-4">{questions[currentQuestion].question}</h3>
                {isCurrentQuestionLocked && (
                  <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                    ℹ️ This question has been locked. You cannot change your answer.
                  </div>
                )}
                <RadioGroup
                  value={selectedAnswers[currentQuestion]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  disabled={isCurrentQuestionLocked}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-2 p-3 rounded-lg border ${
                        isCurrentQuestionLocked 
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <RadioGroupItem 
                        value={index.toString()} 
                        id={`option-${index}`} 
                        disabled={isCurrentQuestionLocked}
                      />
                      <Label 
                        htmlFor={`option-${index}`} 
                        className={`flex-1 ${isCurrentQuestionLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <DialogFooter className="flex justify-between gap-2">
              <div className="text-sm text-gray-500">
                {isCurrentQuestionLocked && "Answer locked"}
              </div>
              <div className="flex gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!currentQuestionAnswered}
                    className="bg-[#c6930a] hover:bg-[#a37808]"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allAnswered}
                    className="bg-[#c6930a] hover:bg-[#a37808]"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-6 py-4">
            {/* Score Summary */}
            <div className="text-center py-6 border-b">
              <div className="text-6xl mb-4">
                {passed ? "🎉" : "📚"}
              </div>
              <h3 className="text-2xl mb-2">Quiz Complete!</h3>
              <div className={`text-3xl mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>
                {score.percentage}%
              </div>
              <p className="text-gray-600 mb-2">
                You scored {score.correct} out of {score.total}
              </p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {passed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">PASSED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span className="font-semibold">FAILED - 70% Required to Pass</span>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Time Taken: {formatTime(completionTime)}</span>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-3">
              <h4 className="font-semibold mb-3">Question Review</h4>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className={`border rounded-lg p-4 ${
                    isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          Question {index + 1}: {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p className={isCorrect ? "text-green-700" : "text-red-700"}>
                            <strong>Your answer:</strong> {question.options[userAnswer]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <DialogFooter>
              <Button onClick={handleClose} className="bg-[#c6930a] hover:bg-[#a37808] w-full">
                {passed ? "Continue to Next Module" : "Close and Retry"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}