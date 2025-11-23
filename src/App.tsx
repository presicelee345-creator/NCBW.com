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