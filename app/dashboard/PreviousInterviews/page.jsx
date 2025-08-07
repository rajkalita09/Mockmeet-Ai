"use client";

import React, { useEffect, useState } from "react";
import InterviewList from "../_components/InterviewList";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";

export default function PreviousInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    async function fetchInterviews() {
      const result = await db.select().from(MockInterview);
      setInterviews(result);
      setLoading(false);
    }
    fetchInterviews();
  }, []);

  const confirmDelete = async () => {
    if (!selectedId) return;

    await db.delete(MockInterview).where(eq(MockInterview.id, selectedId));
    setInterviews((prev) => prev.filter((i) => i.id !== selectedId));
    setShowDeletePopup(false);
    setSelectedId(null);
  };
  
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeletePopup(true);
  };
  
  const cancelDelete = () => {
    setShowDeletePopup(false);
    setSelectedId(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 md:px-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">Previous Mock Interviews</h1>
        <p className="text-gray-600 mb-8">Review your past mock interviews and improve based on feedback.</p>

        {loading ? (
          <div className="text-center text-gray-500">Loading interviews...</div>
        ) : interviews.length > 0 ? (
          <InterviewList interviews={interviews} onDelete={handleDeleteClick} />
        ) : (
          <div className="text-gray-500 text-center">No interviews found.</div>
        )}
      </div>

      {showDeletePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-600 mt-2">Are you sure you want to delete this interview?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded border border-red-300 hover:bg-red-700"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-100"
              >
                Yes
              </button>
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
