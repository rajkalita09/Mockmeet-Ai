"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Gauge, TimerReset, Flame, Star } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardStats({ stats, chartData }) {
  const { totalInterviews, avgScore, totalTime } = stats;

  const tips = [
    "Practice answering behavioral questions using the STAR method.",
    "Keep your answers concise and focused.",
    "Record yourself to evaluate your tone and clarity.",
    "Research the company and tailor your answers accordingly.",
    "Pause briefly before answering to gather your thoughts.",
  ];

  const roles = [
    "AI/ML Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Product Manager",
    "UI/UX Designer",
    "Data Analyst",
    "Cybersecurity Specialist",
    "Cloud Solutions Architect",
  ];

  const [todayTip, setTodayTip] = useState("");
  const [trendingRoles, setTrendingRoles] = useState([]);

  useEffect(() => {
    // Random Tip
    const randomTipIndex = Math.floor(Math.random() * tips.length);
    setTodayTip(tips[randomTipIndex]);

    // Random 4 Roles
    const shuffledRoles = [...roles].sort(() => Math.random() - 0.5);
    setTrendingRoles(shuffledRoles.slice(0, 4));
  }, []);

  const statCards = [
    {
      label: "Total Interviews",
      value: totalInterviews,
      icon: Briefcase,
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
    },
    {
      label: "Average Rating",
      value: avgScore,
      icon: Gauge,
      gradient: "from-emerald-500 via-green-600 to-teal-500",
    },
    {
      label: "Total Time Spent During Interviews",
      value: totalTime,
      icon: TimerReset,
      gradient: "from-fuchsia-500 via-pink-600 to-rose-500",
    },
  ];

  return (
    <div className="space-y-8 mt-8">
      {/* Stats Section */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              className={`rounded-2xl p-5 flex flex-col items-center text-white shadow-lg border border-white/20 bg-gradient-to-br ${stat.gradient}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.07 }}
            >
              <div className="bg-white p-3 rounded-full text-gray-800 shadow-xl">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold mt-3">{stat.value}</p>
              <p className="text-sm font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tip & Trending Roles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div
          className="bg-gradient-to-br from-purple-100 to-purple-200 p-5 rounded-3xl shadow-lg border flex flex-col justify-start"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            <Flame className="w-5 h-5 text-red-500" /> 🔥 Trending Roles
          </h3>
          <ul className="mt-3 space-y-1 text-gray-700 list-none pl-3">
            {trendingRoles.map((role) => (
              <li
                key={role}
                className="flex items-center gap-2 hover:text-purple-600 transition"
              >
                <Star className="w-4 h-4 text-yellow-500" /> {role}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-yellow-100 to-amber-100 p-5 rounded-3xl shadow-lg border flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
            💡 AI Tip of the Day
          </h3>
          <p className="mt-3 text-gray-700">{todayTip}</p>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div
        className="bg-gradient-to-br from-sky-100 to-cyan-100 p-5 rounded-3xl shadow-lg border"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="text-xl font-bold text-gray-800">
          📈 Interview Scores Over Time
        </h3>
        {chartData.length === 0 ? (
          <p className="text-sm text-gray-500 mt-3">No data to display yet.</p>
        ) : (
          <div className="mt-3 w-full overflow-x-auto">
            <div className="min-w-[300px] h-[300px] sm:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke="#06b6d4"
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
