import WelcomeSection from "./_components/WelcomeSection";
import DashboardStatsWrapper from "./_components/DashboardStatsWrapper";
import AddNewInterview from "./_components/AddNewInterview";

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 space-y-10 max-w-screen-lg mx-auto">
      <WelcomeSection />
      <AddNewInterview />
      <DashboardStatsWrapper />

       {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-12">
        © 2025 Mockmeet-Ai. All rights reserved.
      </p>
    </div>

    
  );
}
