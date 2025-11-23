import { Users, GraduationCap, UserCircle, Shield, Award, Lock, BarChart3, Mail } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps {
  selectedPosition: string;
  onSelectPosition: (position: string) => void;
  view: "curriculum" | "profile" | "admin" | "certificate-example" | "reports-example" | "email-example";
  onViewChange: (view: "curriculum" | "profile" | "admin" | "certificate-example" | "reports-example" | "email-example") => void;
  isTrackLocked: (positionId: string) => boolean;
  selectedTrack: string | null;
}

const positions = [
  { id: "president", name: "President" },
  { id: "vice-president", name: "Vice President" },
  { id: "second-vice-president", name: "Second Vice President" },
  { id: "third-vice-president", name: "Third Vice President" },
  { id: "treasurer", name: "Treasurer" },
  { id: "financial-secretary", name: "Financial Secretary" },
  { id: "corresponding-secretary", name: "Corresponding Secretary" },
  { id: "chaplain", name: "Chaplain" },
  { id: "parliamentarian", name: "Parliamentarian" },
];

export function Sidebar({
  selectedPosition,
  onSelectPosition,
  view,
  onViewChange,
  isTrackLocked,
  selectedTrack,
}: SidebarProps) {
  return (
    <div className="w-80 bg-black border-r border-[#c6930a]/20 flex flex-col">
      <div className="p-6 border-b border-[#c6930a]/20">
        <div className="flex items-center gap-3 mb-2">
          <GraduationCap className="w-8 h-8 text-[#c6930a]" />
          <div>
            <h1 className="text-[#c6930a]">NCBW</h1>
            <p className="text-xs text-gray-400">Queen City Metro Chapter</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-6">
          <div>
            <h2 className="px-3 mb-3 text-xs uppercase tracking-wider text-gray-500">
              Navigation
            </h2>
            <button
              onClick={() => onViewChange("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                view === "profile"
                  ? "bg-[#c6930a] text-black"
                  : "text-gray-300 hover:bg-[#c6930a]/10 hover:text-[#c6930a]"
              }`}
            >
              <UserCircle className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>

          <div>
            <h2 className="px-3 mb-3 text-xs uppercase tracking-wider text-gray-500">
              Leadership Tracks
            </h2>
            <div className="space-y-1">
              {positions.map((position) => {
                const isSelected =
                  selectedPosition === position.id && view === "curriculum";
                const showLocked = isTrackLocked(position.id);

                return (
                  <button
                    key={position.id}
                    onClick={() => {
                      onSelectPosition(position.id);
                      onViewChange("curriculum");
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                      isSelected
                        ? "bg-[#c6930a] text-black"
                        : "text-gray-300 hover:bg-[#c6930a]/10 hover:text-[#c6930a]"
                    }`}
                  >
                    {showLocked ? (
                      <Lock className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <Users className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span className="text-sm">{position.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="px-3 mb-3 text-xs uppercase tracking-wider text-gray-500">
              Administration
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => onViewChange("admin")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  view === "admin"
                    ? "bg-[#c6930a] text-black"
                    : "text-gray-300 hover:bg-[#c6930a]/10 hover:text-[#c6930a]"
                }`}
              >
                <Shield className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Admin Dashboard</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="px-3 mb-3 text-xs uppercase tracking-wider text-gray-500">
              Examples
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => onViewChange("certificate-example")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  view === "certificate-example"
                    ? "bg-[#c6930a] text-black"
                    : "text-gray-300 hover:bg-[#c6930a]/10 hover:text-[#c6930a]"
                }`}
              >
                <Award className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Certificate Example</span>
              </button>
              <button
                onClick={() => onViewChange("reports-example")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  view === "reports-example"
                    ? "bg-[#c6930a] text-black"
                    : "text-gray-300 hover:bg-[#c6930a]/10 hover:text-[#c6930a]"
                }`}
              >
                <BarChart3 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Reports Example</span>
              </button>
              <button
                onClick={() => onViewChange("email-example")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                  view === "email-example"
                    ? "bg-[#c6930a] text-black"
                    : "text-gray-300 hover:bg-[#c6930a]/10 hover:text-[#c6930a]"
                }`}
              >
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Email Example</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}