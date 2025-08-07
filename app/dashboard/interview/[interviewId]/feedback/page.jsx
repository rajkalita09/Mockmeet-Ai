"use client";

import { db } from '@/utils/db';
import { UserAnswer, MockInterview } from '@/utils/schema';
import { eq, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Home, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

function Feedback({ params: rawParams }) {
  const params = React.use(rawParams);
  const [feedbackList, setFeedbackList] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      router.push("/dashboard");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const GetFeedback = async () => {
    const result = await db.select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, params.interviewId))
      .orderBy(desc(UserAnswer.createdAt));

    const latestAnswerMap = new Map();
    for (const item of result) {
      if (!latestAnswerMap.has(item.question)) {
        latestAnswerMap.set(item.question, item);
      }
    }

    const allAnswers = [...result].reverse();
    const orderedLatestAnswers = [];
    const seen = new Set();

    for (const item of allAnswers) {
      if (!seen.has(item.question)) {
        orderedLatestAnswers.push(latestAnswerMap.get(item.question));
        seen.add(item.question);
      }
    }

    setFeedbackList(orderedLatestAnswers);
    const ratings = orderedLatestAnswers.map(item => parseFloat(item.rating)).filter(r => !isNaN(r));
    const average = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
    setAverageRating(average);

    const mockInterviewResult = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params.interviewId))
      .execute();

    if (mockInterviewResult[0]?.time_taken) {
      setTimeTaken(mockInterviewResult[0].time_taken);
    }
  };

  const toggleCollapse = (index) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {feedbackList?.length === 0 ? (
        <div className="text-center mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-red-600">No Interview Feedback Found</h2>
          <p className="text-base text-gray-500 mt-3">Complete an interview to see feedback.</p>
        </div>
      ) : (
        <>
          {/* 🎉 Congratulatory Message */}
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="w-full flex justify-center mt-8 sm:mt-12 mb-6 px-4"
>
  <div className="text-center max-w-md">
    <h1
      className="text-purple-600 font-extrabold tracking-tight"
      style={{
        fontSize: 'clamp(1.8rem, 5vw, 3rem)',
        lineHeight: 1.2,
      }}
    >
      🎉 Congratulations!
    </h1>
    <p className="mt-2 text-gray-600 text-sm sm:text-base">
      Your mock interview has been analyzed successfully.
    </p>
  </div>
</motion.div>



          {/* 📊 Stats Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-purple-50 to-white shadow-xl border border-gray-200 rounded-2xl p-4 sm:p-6 text-center mb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3">
                <p className="text-sm text-gray-500">Overall Rating</p>
                <p className="text-xl font-bold text-purple-700">{averageRating}/10</p>
              </div>
              <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-3">
                <p className="text-sm text-gray-500">Time Taken</p>
                <p className="text-xl font-bold text-blue-600">{timeTaken} min</p>
              </div>
            </div>

            {/* 📋 Breakdown Header */}
            <div className="mt-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-gray-600" />
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                  Detailed Breakdown
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Here's a review of your performance including the question, your answer, correct answer, and feedback.
              </p>
            </div>
          </motion.div>

          {/* 🧠 Feedback Questions */}
          <div className="space-y-4 sm:space-y-6">
            {feedbackList.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden transition-all duration-300"
                >
                  {/* Header Button */}
                  <button
                    className="w-full flex justify-between items-center px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-100 to-purple-100 text-left"
                    onClick={() => toggleCollapse(index)}
                  >
                    <span className="text-sm sm:text-base font-medium text-gray-800 flex-1 pr-4 break-words">
                      Q{index + 1}: {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="min-w-[20px] sm:w-6 sm:h-6 text-gray-700" />
                    ) : (
                      <ChevronDown className="min-w-[20px] sm:w-6 sm:h-6 text-gray-700" />
                    )}
                  </button>

                  {/* Collapsible Answer Section */}
                  {isOpen && (
                    <div className="px-4 py-5 sm:px-6 bg-white text-sm sm:text-base text-gray-700 space-y-3 transition-all duration-300 ease-in-out">
                      <p><span className="font-semibold text-black">Your Answer:</span> {item.userAns}</p>
                      <p><span className="font-semibold text-black">Correct Answer:</span> {item.correctAns}</p>
                      <p><span className="font-semibold text-black">Feedback:</span> {item.feedback}</p>
                      <p><span className="font-semibold text-black">Rating:</span> {item.rating}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 🔙 Back to Dashboard */}
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => {
                setLoading(true);
                router.push("/dashboard");
              }}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition"
            >
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              ) : (
                <>
                  <Home size={20} /> Back to Dashboard
                </>
              )}
            </Button>
          </div>
        </>
      )}

      <p className="text-center text-xs text-gray-400 mt-16">© 2025 Mockmeet-AI. All rights reserved.</p>
    </div>
  );
}

export default Feedback;
