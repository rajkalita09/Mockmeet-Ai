"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, UserCircle, Lock, Instagram } from "lucide-react";

export default function AboutContact() {
  return (
    <div className="px-4 sm:px-6 md:px-12 py-10 max-w-6xl mx-auto space-y-10">
      {/* About Us with Image */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8"
      >
       {/* Image */}
        <img
          src="/developer.jpg" // Place your image in the public folder or use an external URL
          alt="Developer"
          className="w-40 h-40 md:w-52 md:h-52 object-cover rounded-full shadow-md border-4 border-green-500"
        />


        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4 flex justify-center md:justify-start items-center gap-2">
            <UserCircle className="w-7 h-7 sm:w-8 sm:h-8" />
            Meet The Developer
          </h2>
          <p className="text-gray-800 leading-relaxed text-[16px] sm:text-[17px]">
            Hi, I’m <span className="text-red-600 font-bold">Raj Kalita</span>, a passionate student of <strong>Artificial Intelligence</strong> and <strong>Data Science</strong>. I created this platform to help
            individuals boost their interview confidence using AI-driven mock interviews, personalized feedback, and performance analytics.
            <br /><br />
            This platform is built with <span className="text-green-600 font-semibold">you</span> in mind — simple, secure, and effective.
          </p>
        </div>
      </motion.div>

      {/* Contact Us */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 sm:p-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
          Contact Me
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <a
            href="https://www.instagram.com/rajkalita_09"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition text-[17px] font-medium"
          >
            <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            @rajkalita_09
          </a>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Feel free to reach out for queries, suggestions, or collaborations!
        </p>
      </motion.div>

      {/* Privacy Note */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 flex items-start gap-3"
      >
        <Lock className="text-gray-500 w-5 h-5 mt-1 flex-shrink-0" />
        <p className="text-gray-700 text-sm leading-relaxed">
          <strong>Privacy First:</strong> Your mock interviews, responses, and
          analytics are securely stored. We don’t track or share your data with any third party. Your trust matters to us.
        </p>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 mt-10">
        © 2025 <span className="font-medium">Mockmeet-AI</span>. All rights reserved.
      </p>
    </div>
  );
}
