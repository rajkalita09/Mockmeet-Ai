"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

export default function WelcomeSection() {
  const { user } = useUser();
  const firstName = user?.firstName || "there";

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 rounded-2xl sm:rounded-3xl shadow-xl w-full max-w-3xl mx-auto transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
        <span className="text-3xl sm:text-4xl md:text-5xl animate-wiggle">👋</span>
        <h2 className="text-xl sm:text-3xl md:text-4xl font-bold leading-snug sm:leading-tight">
          Welcome back, <span className="capitalize">{firstName}</span>
        </h2>
      </div>

      <p className="text-base sm:text-lg md:text-xl font-medium mb-2">
        Ready to{" "}
        <span className="underline decoration-white underline-offset-4">
          sharpen your skills
        </span>
        ?
      </p>

      <p className="text-sm sm:text-base md:text-lg text-white/80">
        🚀 Start a powerful{" "}
        <span className="font-semibold text-white">AI Mock Interview</span> and
        boost your confidence now.
      </p>
    </div>
  );
}
