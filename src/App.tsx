import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { DashboardHeader } from "./components/DashboardHeader";
import { PositionDetail } from "./components/PositionDetail";
import { ProfileView } from "./components/ProfileView";
import { AdminDashboard } from "./components/AdminDashboard";
import { LoginPage } from "./components/LoginPage";
import { TrackSelectionModal } from "./components/TrackSelectionModal";
import { trainingData } from "./data/trainingData";
import { trackApi, progressApi } from "./utils/api";
import { toast } from "sonner@2.0.3";

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
  const [accessToken, setAccessToken] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [trackProgress, setTrackProgress] = useState<any>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Handle login
  const handleLogin = (type: "admin" | "trainee", email: string, token: string, user: any) => {
    setUserType(type);
    setUserEmail(email);
    setAccessToken(token);
    setCurrentUser(user);
    
    // Set initial view based on user type
    if (type === "admin") {
      setView("admin");
    } else {
      setView("curriculum");
      // Check if user already has a selected track
      if (user.selectedTrack) {
        setSelectedTrack(user.selectedTrack);
        setSelectedPosition(user.selectedTrack);
        loadTrackProgress(token, user.selectedTrack);
      }
    }
  };

  // Load track progress from backend
  const loadTrackProgress = async (token: string, trackId: string) => {
    setIsLoadingProgress(true);
    try {
      const response = await progressApi.getProgress(token, trackId);
      if (response.success) {
        setTrackProgress(response.progress);
      }
    } catch (error: any) {
      console.error("Failed to load progress:", error);
      toast.error("Failed to load progress");
    } finally {
      setIsLoadingProgress(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserType(null);
    setUserEmail("");
    setAccessToken("");
    setCurrentUser(null);
    setSelectedTrack(null);
    setTrackProgress(null);
    setView("curriculum");
  };

  // Handle track selection
  const handleTrackSelection = async (trackId: string) => {
    try {
      const response = await trackApi.selectTrack(accessToken, trackId);
      if (response.success) {
        setSelectedTrack(trackId);
        setSelectedPosition(trackId);
        toast.success("Track selected successfully!");
        // Load progress for selected track
        await loadTrackProgress(accessToken, trackId);
      }
    } catch (error: any) {
      console.error("Failed to select track:", error);
      toast.error("Failed to select track");
    }
  };

  // Handle progress updates (for child components)
  const handleProgressUpdate = async () => {
    if (selectedTrack && accessToken) {
      await loadTrackProgress(accessToken, selectedTrack);
    }
  };

  // If not logged in, show login page
  if (!userType) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show track selection modal for trainees who haven't selected a track
  if (userType === "trainee" && !selectedTrack) {
    return <TrackSelectionModal open={true} onSelectTrack={handleTrackSelection} />;
  }

  // Handle track selection - only for admins (trainees are locked to their track)
  const handleSelectPosition = (positionId: string) => {
    if (userType === "admin") {
      setSelectedPosition(positionId);
    }
  };

  // Visual lock state - shows lock icon on non-selected tracks for trainees
  const isTrackLocked = (positionId: string) => {
    if (userType === "admin") return false;
    if (!selectedTrack) return false;
    return positionId !== selectedTrack;
  };

  // Determine track status
  const getTrackStatus = (positionId: string) => {
    // For trainees viewing their selected track
    if (userType === "trainee" && positionId === selectedTrack && trackProgress) {
      return {
        progress: trackProgress.overallProgress || 0,
        isLocked: false,
        isCompleted: trackProgress.overallProgress === 100,
      };
    }
    
    // Default for admins or other tracks
    return {
      progress: 0,
      isLocked: false,
      isCompleted: false,
    };
  };

  const currentPosition = trainingData[selectedPosition];
  const trackStatus = getTrackStatus(selectedPosition);

  // Check if current track is completed (for trainees)
  const isCurrentTrackCompleted = userType === "trainee" && selectedTrack && trackStatus.isCompleted;

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
              accessToken={accessToken}
              trackProgress={trackProgress}
              onProgressUpdate={handleProgressUpdate}
            />
          ) : view === "profile" ? (
            <ProfileView user={currentUser} />
          ) : view === "admin" && userType === "admin" ? (
            <AdminDashboard accessToken={accessToken} />
          ) : null}
        </main>
      </div>
    </div>
  );
}