'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MockInterview } from '@/utils/schema';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Interview() {
  const params = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [webcamEnabled, setWebcamEnabled] = useState(false);

  useEffect(() => {
    if (params?.interviewId) {
      GetInterviewDetails();
    }
  }, [params]);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId))
        .execute();

      const interview = result[0];

      if (interview?.jsonMockResp) {
        const parsed = JSON.parse(interview.jsonMockResp);
        setMockInterviewQuestions(parsed);
      }

      setInterviewData(interview);
    } catch (error) {
      console.error('Error fetching interview details:', error);
    }
  };

  return (
    <div className="min-h-screen p-6 sm:p-10 bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-bold text-3xl sm:text-4xl text-center text-blue-700 mb-8"
      >
        🎯 Let’s Get Started
      </motion.h2>

      {/* Interview Process Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg border border-white/30 mb-10"
      >
        <h3 className="text-xl font-semibold text-blue-800 mb-4">🚀 Interview Process</h3>
        <ul className="text-gray-700 text-sm sm:text-base space-y-3 leading-relaxed">
          <li>🎥 Enable your webcam and microphone to begin the AI-powered mock interview.</li>
          <li>💬 You'll receive <strong>5 AI-generated questions</strong> based on your job role and experience.</li>
          <li>🕒 Answer within <strong>10 minutes</strong>; it auto-submits after that.</li>
          <li>♻️ Reattempt from the <strong>Previous Interviews</strong> section once the time has expired.</li>
          <li>📊 Get AI feedback, tips, and performance report after submission.</li>
        </ul>
        <p className="text-sm text-gray-600 mt-4 italic">
          🔒 <strong>Note:</strong> We never record or store your videos.
        </p>
      </motion.div>

      {/* Grid Layout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
      >
        {/* Left Panel */}
       <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 shadow-md border border-white/30 h-fit">
  <h3 className="text-blue-800 text-lg sm:text-xl font-semibold mb-3">📋 Interview Details</h3>
  <div className="space-y-2 text-gray-800 text-sm sm:text-base">
    <div><strong>Job Role:</strong> {interviewData?.jobPosition || 'Loading...'}</div>
    <div><strong>Description:</strong> {interviewData?.jobDesc || 'Loading...'}</div>
    <div><strong>Experience:</strong> {interviewData?.jobExperience || 'Loading...'} years</div>
  </div>
</div>


        {/* Right Panel */}
        <div className="flex justify-center items-center">
          {webcamEnabled ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="rounded-xl overflow-hidden border-4 border-blue-500 shadow-lg mb-4">
                <Webcam
                  onUserMedia={() => setWebcamEnabled(true)}
                  onUserMediaError={() => setWebcamEnabled(false)}
                  mirrored={true}
                  className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] object-cover rounded"
                />
              </div>
              <Link href={`/dashboard/interview/${params.interviewId}/start`}>
                <Button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full shadow-md text-sm sm:text-base transition-transform hover:scale-105">
                  🚀 Start Interview
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="h-72 w-72 sm:h-80 sm:w-80 bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-md flex flex-col justify-between items-center p-6"
            >
              <WebcamIcon className="h-20 w-20 text-blue-600" />
              <div className="flex flex-col gap-3 w-full">
                <Button
                  onClick={() => setWebcamEnabled(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white rounded-full py-2 transition-all shadow"
                >
                  🎥 Enable Webcam
                </Button>
                <Button
                  disabled={!webcamEnabled}
                  className="bg-green-600 text-white rounded-full py-2 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🚀 Start Interview
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-600 mt-12">
        © 2025 <span className="font-medium">Mockmeet-AI</span>. All rights reserved.
      </p>
    </div>
  );
}
