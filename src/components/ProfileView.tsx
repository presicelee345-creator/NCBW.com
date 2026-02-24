import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { UserCircle, Mail, MapPin, Award, Clock } from "lucide-react";
import { Progress } from "./ui/progress";

interface ProfileViewProps {
  user: any;
}

export function ProfileView({ user }: ProfileViewProps) {
  // Calculate total time (placeholder - would be calculated from actual course completions)
  const totalTimeMinutes = 0;
  const hours = Math.floor(totalTimeMinutes / 60);
  const minutes = totalTimeMinutes % 60;
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl text-[#c6930a] mb-8">Profile</h2>

      <Card className="bg-white border-gray-200 p-8 mb-6 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-[#c6930a]/20 flex items-center justify-center">
            <UserCircle className="w-16 h-16 text-[#c6930a]" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl text-black mb-2">
              {user?.firstName} {user?.lastName}
            </h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c6930a]" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c6930a]" />
                <span>Queen City Metropolitan Chapter</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#c6930a] text-white">
                  {user?.role === 'admin' ? 'Administrator' : 'Trainee'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white border-gray-200 p-8 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[#c6930a]" />
          <h3 className="text-xl text-[#c6930a]">Learning Progress</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total Time Spent</p>
              <p className="text-2xl text-black">{hours}h {minutes}m</p>
              <p className="text-xs text-gray-500 mt-1">Active engagement time</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Selected Track</p>
              <p className="text-lg text-black capitalize">
                {user?.selectedTrack?.replace(/-/g, ' ') || 'Not selected'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Current focus area</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white border-gray-200 p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#c6930a]" />
          <h3 className="text-xl text-[#c6930a]">Organization</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-black mb-1">
              National Coalition of 100 Black Women
            </p>
            <p className="text-sm text-gray-600">
              Queen City Metropolitan Chapter
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Account Status</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                Active
              </Badge>
              {user?.selectedTrack && (
                <Badge className="bg-[#c6930a]/10 text-[#c6930a] border-[#c6930a]/30">
                  Track Selected
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}