import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import DashboardStatsWrapper from "./_components/DashboardStatsWrapper";

export default function Dashboard() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-6 space-y-10 max-w-screen-lg mx-auto">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-2xl transition-all duration-300">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 flex items-center gap-2">
          <span className="animate-pulse text-4xl sm:text-5xl">👋</span>
          Welcome back!
        </h2>
        <p className="text-base sm:text-lg font-medium leading-relaxed">
          Ready to <span className="underline underline-offset-4 decoration-white">sharpen your skills</span> again?
        </p>
        <p className="text-sm sm:text-base text-blue-100 mt-3">
          🚀 Kickstart your journey with a powerful <span className="font-semibold text-white">AI Mock Interview</span> now!
        </p>
      </div>

      {/* Add Interview CTA */}
      <div className="flex justify-center">
        <AddNewInterview />
      </div>

      {/* Dashboard Stats */}
      <div>
        <DashboardStatsWrapper />
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-12">
        © 2025 Mockmeet-Ai. All rights reserved.
      </p>
    </div>
  );
}
