"use client";
import { use, useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "./_components/QuestionsSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Webcam from 'react-webcam'
import Image from 'next/image'

function StartInterview({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();

  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  const startKey = `interviewStart-${params.interviewId}`;

  useEffect(() => {
    const loadAndStart = async () => {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
        .execute();

      const interview = result[0];
      setInterviewData(interview);
      const questions = JSON.parse(interview.jsonMockResp);
      setMockInterviewQuestions(questions);

      let storedStartTime = localStorage.getItem(startKey);
      if (!storedStartTime) {
        storedStartTime = Date.now().toString();
        localStorage.setItem(startKey, storedStartTime);
      }

      const interval = setInterval(async () => {
        const elapsed = Math.floor((Date.now() - parseInt(storedStartTime)) / 1000);
        const remaining = 600 - elapsed;

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);

          if (!isSubmitted) {
            setIsSubmitted(true);
            localStorage.removeItem(startKey);

            const formatted = "10:00";
            await db
              .update(MockInterview)
              .set({ time_taken: formatted })
              .where(eq(MockInterview.mockId, params.interviewId))
              .execute();

            router.push(`/dashboard/interview/${params.interviewId}/feedback`);
          }
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    loadAndStart();
  }, [isSubmitted, params.interviewId, router]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      setShowBackModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="p-4">
      <div className="text-center text-xl font-semibold text-red-600 mb-4">
        Time Left: {formatTime(timeLeft)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuestionsSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          setActiveQuestionIndex={setActiveQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestions={mockInterviewQuestions}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
        </div>
     <div className="flex justify-center md:justify-end gap-12 mt-6 px-12">
        <Button
          onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          disabled={activeQuestionIndex === 0}
          className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
        >
          Prev Question
        </Button>

        {activeQuestionIndex < mockInterviewQuestions.length - 1 ? (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Next Question
          </Button>
        ) : (
          <Link href={`/dashboard/interview/${params.interviewId}/feedback`}>
            <Button
              onClick={async () => {
                setIsSubmitted(true);
                localStorage.removeItem(startKey);

                const elapsed = 600 - timeLeft;
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
                const seconds = (elapsed % 60).toString().padStart(2, "0");
                const formattedTime = `${minutes}:${seconds}`;

                await db
                  .update(MockInterview)
                  .set({ time_taken: formattedTime })
                  .where(eq(MockInterview.mockId, params.interviewId))
                  .execute();
              }}
              className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
            >
              Finish Interview
            </Button>
          </Link>
        )}
      </div>

      {showBackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to leave the interview?
            </h2>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setShowBackModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black"
              >
                No, Stay
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem(startKey);
                  router.push("/dashboard");
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Leave
              </Button>
            </div>
            
          </div>
          
        </div>
        
      )}
      {/* Footer Line */}
      <p className="text-center text-sm text-gray-500 mt-12">
        © 2025 Mockmeet-Ai. All rights reserved.
      </p>
    </div>
  );
}

export default StartInterview;
