"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Mic, Star, Clock, LineChart } from 'lucide-react';

const steps = [
  {
    title: "1. Create Interview",
    desc: "Select the language, Choose a role, add job details and years of experience.",
    icon: <ClipboardList className="text-green-600 w-8 h-8" />,
  },
  {
    title: "2. Answer The Questions",
    desc: "Respond via text or voice. Your answers are analyzed by AI.",
    icon: <Mic className="text-green-600 w-8 h-8" />,
  },
  {
    title: "3. Get Feedback",
    desc: "Receive actionable, detailed feedback to help you improve.",
    icon: <Star className="text-green-600 w-8 h-8" />,
  },
];

const stats = [
  {
    title: "Total Interviews",
    desc: "Shows how many mock interviews you’ve created and completed.",
    icon: <ClipboardList className="text-blue-500 w-6 h-6" />,
  },
  {
    title: "Average Rating",
    desc: "Based on scores given to your answers. Higher = better.",
    icon: <Star className="text-yellow-500 w-6 h-6" />,
  },
  {
    title: "Total Time Spent",
    desc: "Adds up all the time you spent in mock interviews.",
    icon: <Clock className="text-red-500 w-6 h-6" />,
  },
  {
    title: "Scores Over Time",
    desc: "Tracks how your performance improves day by day.",
    icon: <LineChart className="text-purple-500 w-6 h-6" />,
  },
];

export default function HowItWorks() {
  return (
    <div className="p-6 sm:p-10">
      <motion.h1
        className="text-3xl font-bold mb-10 text-green-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        How It Works?
      </motion.h1>

      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-6 border rounded-2xl shadow-md hover:shadow-xl transition hover:scale-[1.02] space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.2 }}
          >
            {step.icon}
            <h2 className="text-lg font-semibold">{step.title}</h2>
            <p className="text-gray-700">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.h2
        className="text-2xl font-bold text-blue-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        📊 How Your Stats Are Calculated
      </motion.h2>

      <div className="grid sm:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-gray-50 p-5 border rounded-xl shadow-sm flex items-start gap-4 hover:shadow-md transition"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.2 }}
          >
            {stat.icon}
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-gray-700 mt-1 text-sm">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
       {/* Footer Line */}
      <p className="text-center text-sm text-gray-500 mt-12">
        © 2025 Mockmeet-Ai. All rights reserved.
      </p>
    </div>
  );
}
