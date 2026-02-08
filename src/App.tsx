import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { PositionDetail } from "./components/PositionDetail";
import { ProfileView } from "./components/ProfileView";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginPage } from "./components/LoginPage";
import {
  trainingData,
  trackProgress,
} from "./data/trainingData";

type ViewType = "curriculum" | "profile" | "admin";
type UserType = "admin" | "trainee" | null;

export default function App() {
  const [selectedPosition, setSelectedPosition] =
    useState<string>("president");
  const [view, setView] = useState<ViewType>("curriculum");
  const [selectedTrack, setSelectedTrack] = useState<
    string | null
  >(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  // Handle login
  const handleLogin = (type: "admin" | "trainee", email: string) => {
    setUserType(type);
    setUserEmail(email);
    // Set initial view based on user type
    if (type === "admin") {
      setView("admin");
    } else {
      setView("curriculum");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserType(null);
    setUserEmail("");
    setView("curriculum");
  };

  // If not logged in, show login page
  if (!userType) {
    return <LoginPage onLogin={handleLogin} />;
  }

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
        userType={userType}
        onLogout={handleLogout}
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
          ) : view === "admin" && userType === "admin" ? (
            <AdminDashboard />
          ) : null}
        </main>
      </div>
    </div>
  );
}