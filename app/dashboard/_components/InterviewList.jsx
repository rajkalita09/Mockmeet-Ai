"use client";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema"; // ✅ Import both
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

function InterviewList() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [timers, setTimers] = useState({}); // { mockId: secondsRemaining }
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [interviewList]);

  const GetInterviewList = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));

    setInterviewList(result);
  };
  
  const updateCountdowns = () => {
    const newTimers = {};
    interviewList.forEach((item) => {
      const startKey = `interviewStart-${item.mockId}`;
      const startTime = localStorage.getItem(startKey);
      if (startTime) {
        const elapsed = Math.floor((Date.now() - parseInt(startTime)) / 1000);
        const remaining = 600 - elapsed;
        if (remaining > 0) {
          newTimers[item.mockId] = remaining;
        } else {
          localStorage.removeItem(startKey);
        }
      }
    });
    setTimers(newTimers);
  };
  
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60).toString().padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeletePopup(true);
  };
  
  const confirmDelete = async () => {
  if (!selectedId) return;

  try {
    // 1️⃣ Find selected interview
    const selectedInterview = interviewList.find((i) => i.id === selectedId);
    if (!selectedInterview) {
      alert("Interview not found.");
      return;
    }

    // 2️⃣ Get its `mockId` (string!)
    const mockId = selectedInterview.mockId;

    // 3️⃣ Delete associated user answers
    await db.delete(UserAnswer).where(eq(UserAnswer.mockIdRef, mockId));

    // 4️⃣ Delete the parent mock interview
    await db.delete(MockInterview).where(eq(MockInterview.id, selectedId));

    // 5️⃣ Update state
    setInterviewList((prev) => prev.filter((i) => i.id !== selectedId));
    setShowDeletePopup(false);
    setSelectedId(null);
  } catch (error) {
    console.error("Error deleting interview and answers:", error);
    alert("An error occurred while deleting the interview.");
  }
};



  
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedId(null);
  };
  
  return (
    <div>
      <h2 className="font-medium text-xl mb-4">Your Previous Interviews</h2>
      <div className="space-y-4">
        {interviewList.length > 0 ? (
          interviewList.map((item, index) => {
            const secondsLeft = timers[item.mockId];
            const showTimer = secondsLeft && secondsLeft > 0;

            return (
              <div
                key={index}
                className="border border-gray-300 rounded-xl shadow-md p-5 bg-white hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg text-blue-600 mb-2">
                  {item.jobPosition}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-black">Job Description:</span> {item.jobDesc}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-black">Job Experience:</span> {item.jobExperience}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-black">Created At:</span> {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 items-center">
                  <a
                    href={`/dashboard/interview/${item.mockId}/feedback`}
                    className="text-blue-500 hover:underline"
                  >
                    View Feedback
                  </a>

                  {showTimer ? (
                    <span className="text-red-500 font-semibold">
                      Start again in {formatTime(secondsLeft)}
                    </span>
                  ) : (
                    <a
                      href={`/dashboard/interview/${item.mockId}/start?reset=true`}
                      className="text-green-600 font-semibold hover:underline"
                    >
                      Start Again
                    </a>
                  )}

                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No previous interviews found.</p>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this interview? </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewList;
