import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { trackOrder, trainingData } from "../data/trainingData";
import { Crown, Users, Calculator, FileText, Mail, BookOpen, Scale } from "lucide-react";

interface TrackSelectionModalProps {
  open: boolean;
  onSelectTrack: (trackId: string) => void;
}

const trackIcons: Record<string, any> = {
  "president": Crown,
  "vice-president": Users,
  "second-vice-president": Users,
  "third-vice-president": Users,
  "treasurer": Calculator,
  "financial-secretary": FileText,
  "corresponding-secretary": Mail,
  "chaplain": BookOpen,
  "parliamentarian": Scale,
};

export function TrackSelectionModal({ open, onSelectTrack }: TrackSelectionModalProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedTrack) {
      onSelectTrack(selectedTrack);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#c6930a]">
            Select Your Leadership Track
          </DialogTitle>
          <DialogDescription>
            Choose the leadership position you want to train for. You will focus on this track until completion.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {trackOrder.map((trackId) => {
            const track = trainingData[trackId];
            const Icon = trackIcons[trackId] || Crown;
            const isSelected = selectedTrack === trackId;

            return (
              <Card
                key={trackId}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? "border-[#c6930a] border-2 bg-[#c6930a]/5"
                    : "border-gray-200 hover:border-[#c6930a]/50"
                }`}
                onClick={() => setSelectedTrack(trackId)}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div
                    className={`p-3 rounded-full ${
                      isSelected ? "bg-[#c6930a] text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{track.name}</h3>
                    <p className="text-xs text-gray-600 line-clamp-3">
                      {track.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="text-[#c6930a] text-xs font-semibold">
                      ✓ Selected
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={handleConfirm}
            disabled={!selectedTrack}
            className="bg-[#c6930a] hover:bg-[#a37808] text-white"
          >
            Confirm Selection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
