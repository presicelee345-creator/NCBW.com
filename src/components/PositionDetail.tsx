import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, FileCheck, Lock, CheckCircle2, ExternalLink } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Progress } from "./ui/progress";
import { QuizModal } from "./QuizModal";
import { toast } from "sonner@2.0.3";
import { progressApi, quizApi } from "../utils/api";

interface Course {
  title: string;
  platform: string;
  duration: string;
  link?: string;
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
  accessToken: string;
  trackProgress: any;
  onProgressUpdate: () => Promise<void>;
}

export function PositionDetail({ position, accessToken, trackProgress, onProgressUpdate }: PositionDetailProps) {
  const isLocked = position.isLocked || false;
  const isCompleted = position.isCompleted || false;
  const progress = position.progress || 0;
  const [selectedQuiz, setSelectedQuiz] = useState<{ title: string; duration: string; moduleIndex: number; trackId: string } | null>(null);
  
  // Get completed modules and courses from trackProgress
  const completedModules = trackProgress?.completedModules || [];
  const completedCourses = trackProgress?.completedCourses || {};
  const trackId = trackProgress?.trackId || position.name.toLowerCase().replace(/ /g, '-');

  const handleQuizComplete = async (score: number) => {
    const passingScore = 70;
    
    if (!selectedQuiz) return;
    
    try {
      // Submit quiz to backend
      const response = await quizApi.submitQuiz(
        accessToken,
        selectedQuiz.trackId,
        selectedQuiz.moduleIndex,
        score
      );
      
      if (response.passed) {
        toast.success(`Quiz passed with ${score}%! Great job! Next module unlocked.`);
      } else {
        toast.warning(`Score: ${score}%. You need ${passingScore}% to pass. Please try again to unlock the next module.`);
      }
      
      // Refresh progress
      await onProgressUpdate();
    } catch (error: any) {
      console.error("Failed to submit quiz:", error);
      toast.error("Failed to submit quiz");
    } finally {
      setSelectedQuiz(null);
    }
  };

  const handleQuizClick = (quiz: { title: string; duration: string }, moduleIndex: number) => {
    // Check if all courses in this module are completed
    const totalCourses = position.attributes[moduleIndex].courses.length;
    const completedInModule = completedCourses[moduleIndex]?.length || 0;
    
    if (completedInModule < totalCourses) {
      toast.warning("Please complete all courses in this module before taking the quiz");
      return;
    }
    
    // Check if this module is unlocked
    if (isModuleUnlocked(moduleIndex)) {
      setSelectedQuiz({ ...quiz, moduleIndex, trackId });
    }
  };

  // Check if a module is unlocked
  const isModuleUnlocked = (moduleIndex: number) => {
    // First module is always unlocked
    if (moduleIndex === 0) return true;
    
    // Other modules are unlocked if the previous module is completed (quiz passed)
    return completedModules.includes(moduleIndex - 1);
  };

  // Check if a course is unlocked within a module
  const isCourseUnlocked = (moduleIndex: number, courseIndex: number) => {
    // Module must be unlocked first
    if (!isModuleUnlocked(moduleIndex)) return false;
    
    // First course in module is always unlocked
    if (courseIndex === 0) return true;
    
    // Other courses are unlocked if previous course is completed
    const completedInModule = completedCourses[moduleIndex] || [];
    return completedInModule.includes(courseIndex - 1);
  };

  // Check if a course is completed
  const isCourseCompleted = (moduleIndex: number, courseIndex: number) => {
    const completedInModule = completedCourses[moduleIndex] || [];
    return completedInModule.includes(courseIndex);
  };

  // Handle course click - mark as completed and open link
  const handleCourseClick = async (moduleIndex: number, courseIndex: number, courseLink?: string) => {
    if (!isCourseUnlocked(moduleIndex, courseIndex)) {
      toast.warning("Complete the previous course to unlock this one");
      return;
    }
    
    if (!courseLink) {
      toast.warning("No link available for this course");
      return;
    }
    
    // Open course in new tab
    window.open(courseLink, '_blank', 'noopener,noreferrer');
    
    // Mark course as completed if not already completed
    if (!isCourseCompleted(moduleIndex, courseIndex)) {
      try {
        await progressApi.markCourseComplete(accessToken, trackId, moduleIndex, courseIndex);
        toast.success("Course marked as completed!");
        await onProgressUpdate();
      } catch (error: any) {
        console.error("Failed to mark course as completed:", error);
        toast.error("Failed to mark course as completed");
      }
    }
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
                <p className="text-sm text-gray-600">Modules Completed</p>
                <p className="text-lg text-black mt-1">{completedModules.length} of {position.attributes.length}</p>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-500 mt-3">
              Complete courses in order within each module. Pass each quiz with 70% or higher to unlock the next module.
            </p>
          </Card>
        </div>

        {/* Modules */}
        <div className="space-y-8">
          {position.attributes.map((attribute, idx) => {
            const moduleUnlocked = isModuleUnlocked(idx);
            const moduleLocked = !moduleUnlocked;
            const moduleCompleted = completedModules.includes(idx);
            const totalCourses = attribute.courses.length;
            const completedInModule = completedCourses[idx]?.length || 0;
            const allCoursesCompleted = completedInModule >= totalCourses;

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
                    {moduleCompleted && (
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
                  {!moduleLocked && !moduleCompleted && (
                    <p className="text-sm text-[#c6930a] mt-2">
                      Progress: {completedInModule} of {totalCourses} courses completed
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  {attribute.courses.map((course, courseIdx) => {
                    const courseUnlocked = isCourseUnlocked(idx, courseIdx);
                    const courseLocked = !courseUnlocked;
                    const courseCompleted = isCourseCompleted(idx, courseIdx);

                    return (
                      <div
                        key={courseIdx}
                        onClick={() => {
                          if (courseUnlocked) {
                            handleCourseClick(idx, courseIdx, course.link);
                          }
                        }}
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                          courseLocked
                            ? "bg-gray-50 border-gray-200"
                            : courseCompleted
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200 hover:border-[#c6930a]/30 group cursor-pointer"
                        }`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {courseLocked && (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                            {courseCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            <h4 className={
                              courseLocked 
                                ? "text-gray-500" 
                                : courseCompleted
                                  ? "text-green-700"
                                  : "text-black group-hover:text-[#c6930a] transition-colors"
                            }>
                              {course.title}
                            </h4>
                            {courseUnlocked && !courseLocked && course.link && (
                              <ExternalLink className="w-3 h-3 text-[#c6930a] opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge
                              variant="outline"
                              className={
                                courseLocked
                                  ? "bg-gray-100 text-gray-500 border-gray-300"
                                  : courseCompleted
                                    ? "bg-green-100 text-green-700 border-green-300"
                                    : "bg-[#c6930a]/10 text-[#c6930a] border-[#c6930a]/30"
                              }
                            >
                              {course.platform}
                            </Badge>
                            <div className={`flex items-center gap-1 text-xs ${
                              courseLocked ? "text-gray-400" : courseCompleted ? "text-green-600" : "text-gray-600"
                            }`}>
                              <Clock className="w-3 h-3" />
                              <span>{course.duration}</span>
                            </div>
                            {courseCompleted && (
                              <span className="text-xs text-green-600">✓ Completed</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quiz at the end of each module */}
                  {attribute.quiz && (
                    <div 
                      onClick={() => {
                        if (moduleUnlocked && allCoursesCompleted) {
                          handleQuizClick(attribute.quiz!, idx);
                        } else if (moduleUnlocked && !allCoursesCompleted) {
                          toast.warning("Complete all courses in this module before taking the quiz");
                        }
                      }}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                        moduleLocked || !allCoursesCompleted
                          ? "bg-gray-50 border-gray-200"
                          : moduleCompleted
                            ? "bg-green-50 border-green-200"
                            : "bg-[#c6930a]/5 border-[#c6930a]/30 hover:border-[#c6930a]/50 group cursor-pointer"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileCheck className={`w-4 h-4 ${
                            moduleLocked || !allCoursesCompleted 
                              ? "text-gray-400" 
                              : moduleCompleted
                                ? "text-green-600"
                                : "text-[#c6930a]"
                          }`} />
                          <h4 className={
                            moduleLocked || !allCoursesCompleted
                              ? "text-gray-500" 
                              : moduleCompleted
                                ? "text-green-700"
                                : "text-black group-hover:text-[#c6930a] transition-colors"
                          }>
                            {attribute.quiz.title}
                          </h4>
                          {moduleCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge
                            variant="outline"
                            className={
                              moduleLocked || !allCoursesCompleted
                                ? "bg-gray-100 text-gray-500 border-gray-300"
                                : moduleCompleted
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : "bg-[#c6930a]/20 text-[#c6930a] border-[#c6930a]/40"
                            }
                          >
                            Quiz - Pass with 70% to unlock next module
                          </Badge>
                          <div className={`flex items-center gap-1 text-xs ${
                            moduleLocked || !allCoursesCompleted 
                              ? "text-gray-400" 
                              : moduleCompleted
                                ? "text-green-600"
                                : "text-gray-600"
                          }`}>
                            <Clock className="w-3 h-3" />
                            <span>{attribute.quiz.duration}</span>
                          </div>
                        </div>
                        {!allCoursesCompleted && moduleUnlocked && (
                          <p className="text-xs text-gray-500 mt-2">
                            Complete all {totalCourses} courses to unlock this quiz
                          </p>
                        )}
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