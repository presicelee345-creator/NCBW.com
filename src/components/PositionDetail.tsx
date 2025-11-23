import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, FileCheck, Lock, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { QuizModal } from "./QuizModal";
import { toast } from "sonner@2.0.3";

interface Course {
  title: string;
  platform: string;
  duration: string;
}

interface Attribute {
  title: string;
  description: string;
  courses: Course[];
  quiz?: {
    title: string;
    duration: string;
  };
}

interface Position {
  name: string;
  description: string;
  attributes: Attribute[];
  progress?: number;
  isLocked?: boolean;
  isCompleted?: boolean;
}

interface PositionDetailProps {
  position: Position;
}

export function PositionDetail({ position }: PositionDetailProps) {
  const isLocked = position.isLocked || false;
  const isCompleted = position.isCompleted || false;
  const progress = position.progress || 0;
  const [selectedQuiz, setSelectedQuiz] = useState<{ title: string; duration: string; moduleIndex: number } | null>(null);
  
  // Track which modules have been completed (quiz passed with 70%+)
  // In a real app, this would be stored in a database
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set([0])); // First module is unlocked by default

  const handleQuizComplete = (score: number) => {
    const passingScore = 70;
    
    if (score >= passingScore) {
      toast.success(`Quiz passed with ${score}%! Great job!`);
      
      // Mark current module as complete and unlock next module
      if (selectedQuiz) {
        const nextModule = selectedQuiz.moduleIndex + 1;
        setCompletedModules(prev => {
          const newSet = new Set(prev);
          newSet.add(nextModule);
          return newSet;
        });
      }
    } else {
      toast.warning(`Score: ${score}%. You need ${passingScore}% to pass. Please try again to unlock the next module.`);
    }
    setSelectedQuiz(null);
  };

  const handleQuizClick = (quiz: { title: string; duration: string }, moduleIndex: number) => {
    // Check if this module is unlocked
    if (completedModules.has(moduleIndex)) {
      setSelectedQuiz({ ...quiz, moduleIndex });
    }
  };

  // Check if a module is unlocked (previous module completed or it's the first one)
  const isModuleUnlocked = (moduleIndex: number) => {
    return completedModules.has(moduleIndex);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Track Header with Progress */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl text-[#c6930a]">{position.name}</h2>
                {isLocked && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
                {isCompleted && (
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
              <p className="text-gray-700">{position.description}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="bg-white border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm text-gray-600">Track Progress</h3>
                <p className="text-2xl text-[#c6930a] mt-1">{progress}% Complete</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Modules Unlocked</p>
                <p className="text-lg text-black mt-1">{completedModules.size} of {position.attributes.length}</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-500 mt-3">
              Complete each quiz with 70% or higher to unlock the next module.
            </p>
          </Card>
        </div>

        {/* Modules */}
        <div className="space-y-8">
          {position.attributes.map((attribute, idx) => {
            const moduleUnlocked = isModuleUnlocked(idx);
            const moduleLocked = !moduleUnlocked;

            return (
              <Card
                key={idx}
                className={`bg-white border-gray-200 p-6 transition-colors shadow-sm ${
                  moduleLocked
                    ? "opacity-60" 
                    : "hover:border-[#c6930a]/40"
                }`}
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl text-[#c6930a]">
                      {attribute.title}
                    </h3>
                    {moduleLocked && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                    {completedModules.has(idx + 1) && (
                      <Badge className="bg-green-100 text-green-700 border-green-300">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{attribute.description}</p>
                  {moduleLocked && (
                    <p className="text-sm text-[#c6930a] mt-2">
                      Complete the previous module's quiz to unlock this module.
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {attribute.courses.map((course, courseIdx) => {
                    return (
                      <div
                        key={courseIdx}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                          moduleLocked
                            ? "bg-gray-50 border-gray-200"
                            : "bg-gray-50 border-gray-200 hover:border-[#c6930a]/30 group cursor-pointer"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={moduleLocked ? "text-gray-500" : "text-black group-hover:text-[#c6930a] transition-colors"}>
                              {course.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge
                              variant="outline"
                              className={
                                moduleLocked
                                  ? "bg-gray-100 text-gray-500 border-gray-300"
                                  : "bg-[#c6930a]/10 text-[#c6930a] border-[#c6930a]/30"
                              }
                            >
                              {course.platform}
                            </Badge>
                            <div className={`flex items-center gap-1 text-xs ${moduleLocked ? "text-gray-400" : "text-gray-600"}`}>
                              <Clock className="w-3 h-3" />
                              <span>{course.duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quiz at the end of each module */}
                  {attribute.quiz && (
                    <div 
                      onClick={() => {
                        if (moduleUnlocked) {
                          handleQuizClick(attribute.quiz!, idx);
                        }
                      }}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                        moduleLocked
                          ? "bg-gray-50 border-gray-200"
                          : "bg-[#c6930a]/5 border-[#c6930a]/30 hover:border-[#c6930a]/50 group cursor-pointer"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileCheck className={`w-4 h-4 ${moduleLocked ? "text-gray-400" : "text-[#c6930a]"}`} />
                          <h4 className={moduleLocked ? "text-gray-500" : "text-black group-hover:text-[#c6930a] transition-colors"}>
                            {attribute.quiz.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge
                            variant="outline"
                            className={
                              moduleLocked
                                ? "bg-gray-100 text-gray-500 border-gray-300"
                                : "bg-[#c6930a]/20 text-[#c6930a] border-[#c6930a]/40"
                            }
                          >
                            Quiz - Pass with 70% to unlock next module
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${moduleLocked ? "text-gray-400" : "text-gray-600"}`}>
                            <Clock className="w-3 h-3" />
                            <span>{attribute.quiz.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quiz Modal */}
      {selectedQuiz && (
        <QuizModal
          isOpen={true}
          onClose={() => setSelectedQuiz(null)}
          quizTitle={selectedQuiz.title}
          duration={selectedQuiz.duration}
          onComplete={handleQuizComplete}
        />
      )}
    </ScrollArea>
  );
}
