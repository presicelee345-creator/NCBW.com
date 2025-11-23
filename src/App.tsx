import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { PositionDetail } from "./components/PositionDetail";
import { ProfileView } from "./components/ProfileView";
import { AdminDashboard } from "./components/AdminDashboard";
import { ReportsExample } from "./components/ReportsExample";
import { EmailExample } from "./components/EmailExample";
import {
  trainingData,
  trackOrder,
  trackProgress,
} from "./data/trainingData";

type ViewType =
  | "curriculum"
  | "profile"
  | "admin"
  | "quiz-example"
  | "certificate-example"
  | "reports-example"
  | "email-example";

export default function App() {
  const [selectedPosition, setSelectedPosition] =
    useState<string>("president");
  const [view, setView] = useState<ViewType>("curriculum");
  const [selectedTrack, setSelectedTrack] = useState<
    string | null
  >(null);

  // Handle track selection - any track can be selected, but others appear locked
  const handleSelectPosition = (positionId: string) => {
    setSelectedTrack(positionId);
    setSelectedPosition(positionId);
  };

  // Visual lock state - shows lock icon on non-selected tracks
  const isTrackLocked = (positionId: string) => {
    if (!selectedTrack) return false;
    return positionId !== selectedTrack;
  };

  // Determine track status
  const getTrackStatus = (positionId: string) => {
    const progress = trackProgress[positionId] || 0;
    const isCompleted = progress === 100;

    // Track is never truly locked, just visually appears locked when not selected
    const isLocked = false;

    return { progress, isLocked, isCompleted };
  };

  const currentPosition = trainingData[selectedPosition];
  const trackStatus = getTrackStatus(selectedPosition);

  return (
    <div className="flex h-screen bg-white text-black">
      <Sidebar
        selectedPosition={selectedPosition}
        onSelectPosition={handleSelectPosition}
        view={view}
        onViewChange={setView}
        isTrackLocked={isTrackLocked}
        selectedTrack={selectedTrack}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-white">
          {view === "curriculum" ? (
            <PositionDetail
              position={{
                ...currentPosition,
                ...trackStatus,
              }}
            />
          ) : view === "profile" ? (
            <ProfileView />
          ) : view === "admin" ? (
            <AdminDashboard />
          ) : view === "reports-example" ? (
            <ReportsExample />
          ) : view === "email-example" ? (
            <EmailExample />
          ) : view === "quiz-example" ? (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl mb-4 text-[#c6930a]">
                  Quiz Example
                </h2>
                <p className="text-gray-600 mb-6">
                  This is an example of how quizzes appear after
                  completing course modules. Each quiz contains
                  5 questions designed to test your
                  understanding of the material.
                </p>
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl mb-2">
                        Leadership & Strategic Visioning
                        Assessment
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Duration: 15 mins • 5 Questions
                      </p>
                      <div className="h-2 bg-gray-200 rounded-full mb-6">
                        <div
                          className="h-full bg-[#c6930a] rounded-full"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border-t pt-4">
                        <p className="mb-4">Question 2 of 5</p>
                        <h4 className="mb-4">
                          Which approach is most effective for
                          leadership development?
                        </h4>
                        <div className="space-y-2">
                          <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="quiz-example"
                                className="text-[#c6930a]"
                              />
                              <span>Working in isolation</span>
                            </label>
                          </div>
                          <div className="p-3 rounded-lg border border-[#c6930a] bg-[#c6930a]/5">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="quiz-example"
                                checked
                                className="text-[#c6930a]"
                              />
                              <span className="text-[#c6930a]">
                                Continuous learning and practice
                              </span>
                            </label>
                          </div>
                          <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="quiz-example"
                                className="text-[#c6930a]"
                              />
                              <span>Avoiding challenges</span>
                            </label>
                          </div>
                          <div className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <label className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="radio"
                                name="quiz-example"
                                className="text-[#c6930a]"
                              />
                              <span>Resisting change</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Previous
                      </button>
                      <button className="px-4 py-2 bg-[#c6930a] text-white rounded-lg hover:bg-[#a37808]">
                        Next Question
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : view === "certificate-example" ? (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl mb-4 text-[#c6930a]">
                  Certificate Example
                </h2>
                <p className="text-gray-600 mb-6">
                  This is an example of the certificate trainees
                  receive upon completing their leadership
                  track.
                </p>
                <div className="bg-gradient-to-br from-black to-gray-800 p-8 rounded-lg">
                  <div className="bg-white border-[15px] border-[#c6930a] rounded-lg p-12 text-center relative">
                    <div className="absolute top-6 left-6 right-6 bottom-6 border-2 border-[#c6930a] rounded-lg pointer-events-none"></div>

                    <div className="text-5xl mb-2">👑</div>
                    <div className="text-xl text-[#c6930a] tracking-wider mb-1">
                      NATIONAL COALITION OF 100 BLACK WOMEN
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Queen City Metropolitan Chapter
                    </div>

                    <div className="text-3xl text-[#c6930a] tracking-widest mb-4">
                      CERTIFICATE OF COMPLETION
                    </div>

                    <div className="text-sm text-gray-600 italic mb-3">
                      This certificate is proudly presented to
                    </div>

                    <div className="text-3xl mb-6 underline decoration-[#c6930a] decoration-2 underline-offset-8">
                      Jane Doe
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      For successfully completing the
                      comprehensive leadership training program
                    </div>

                    <div className="text-xl text-[#c6930a] mb-6">
                      President Leadership Track
                    </div>

                    <div className="text-sm text-gray-600 mb-8">
                      Demonstrating dedication, knowledge, and
                      commitment to excellence in leadership
                      development
                    </div>

                    <div className="text-sm text-gray-600 mb-8">
                      Date of Completion: November 2, 2025
                    </div>

                    <div className="flex justify-around gap-8 mt-10">
                      <div className="flex-1 border-t-2 border-black pt-2">
                        <div className="text-xs text-gray-600">
                          Administrator Signature
                        </div>
                      </div>
                      <div className="flex-1 border-t-2 border-black pt-2">
                        <div className="text-xs text-gray-600">
                          Chapter President
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}