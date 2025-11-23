import { useState } from "react";
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
      question: `What is a key principle covered in ${quizTitle}?`,
      options: [
        "Understanding fundamental concepts",
        "Ignoring best practices",
        "Avoiding collaboration",
        "Dismissing feedback",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which approach is most effective for leadership development?",
      options: [
        "Working in isolation",
        "Continuous learning and practice",
        "Avoiding challenges",
        "Resisting change",
      ],
      correctAnswer: 1,
    },
    {
      question: "What is essential for successful organizational management?",
      options: [
        "Ignoring team input",
        "Clear communication and collaboration",
        "Maintaining rigid structures",
        "Avoiding accountability",
      ],
      correctAnswer: 1,
    },
    {
      question: "How should a leader approach difficult situations?",
      options: [
        "Avoid making decisions",
        "Blame others",
        "Analyze thoughtfully and act decisively",
        "Ignore the problem",
      ],
      correctAnswer: 2,
    },
    {
      question: "What contributes to effective team dynamics?",
      options: [
        "Lack of communication",
        "Trust, respect, and open dialogue",
        "Rigid hierarchies",
        "Individual competition",
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

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = (score / questions.length) * 100;
    setIsSubmitted(true);
    onComplete(percentage);
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);
    onClose();
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = selectedAnswers.length === questions.length && 
    selectedAnswers.every((answer) => answer !== undefined);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#c6930a]">{quizTitle}</DialogTitle>
          <DialogDescription>
            Duration: {duration} • {questions.length} Questions
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
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
                <RadioGroup
                  value={selectedAnswers[currentQuestion]?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 border border-gray-200">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <DialogFooter className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <Button
                    onClick={handleNext}
                    disabled={selectedAnswers[currentQuestion] === undefined}
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
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {selectedAnswers.reduce((acc, answer, index) => 
                answer === questions[index].correctAnswer ? acc + 1 : acc, 0
              ) / questions.length >= 0.7 ? "🎉" : "📚"}
            </div>
            <h3 className="text-2xl mb-2">Quiz Complete!</h3>
            <p className="text-gray-600 mb-4">
              You scored {selectedAnswers.reduce((acc, answer, index) => 
                answer === questions[index].correctAnswer ? acc + 1 : acc, 0
              )} out of {questions.length} ({Math.round((selectedAnswers.reduce((acc, answer, index) => 
                answer === questions[index].correctAnswer ? acc + 1 : acc, 0
              ) / questions.length) * 100)}%)
            </p>
            <Button onClick={handleClose} className="bg-[#c6930a] hover:bg-[#a37808]">
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
