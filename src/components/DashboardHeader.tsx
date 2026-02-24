interface DashboardHeaderProps {
  userProfile?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export function DashboardHeader({ userProfile }: DashboardHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-[#c6930a]">Training Curriculum</h1>
          <p className="text-sm text-gray-600 mt-1">
            Leadership Development Program
          </p>
        </div>
        {userProfile && (
          <div className="text-right">
            <p className="text-sm text-black font-medium">
              {userProfile.firstName} {userProfile.lastName}
            </p>
            <p className="text-xs text-gray-600">{userProfile.email}</p>
          </div>
        )}
      </div>
    </header>
  );
}