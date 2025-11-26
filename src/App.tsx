import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { PositionDetail } from "./components/PositionDetail";
import { ProfileView } from "./components/ProfileView";
import { AdminDashboard } from "./components/AdminDashboard";
import {
  trainingData,
  trackProgress,
} from "./data/trainingData";

type ViewType = "curriculum" | "profile" | "admin";

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
          ) : null}
        </main>
      </div>
    </div>
  );
}