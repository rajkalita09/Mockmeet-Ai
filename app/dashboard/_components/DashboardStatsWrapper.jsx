import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import DashboardStats from "./DashboardStats";

export default async function DashboardStatsWrapper() {
  const user = await currentUser();

  if (!user || !user.emailAddresses?.[0]?.emailAddress) {
    return (
      <div className="text-red-500 text-center p-4">
        You must be logged in to see stats.
      </div>
    );
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  // ✅ Get mock interviews
  const interviews = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, userEmail));
  const totalInterviews = interviews.length;

  // ✅ Get user answers
  const answers = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.userEmail, userEmail));
  const totalAnswers = answers.length;

  // ✅ Avg rating
  const totalRating = answers.reduce(
    (sum, ans) => sum + parseFloat(ans.rating ?? "0"),
    0
  );
  const avgScore = totalAnswers
    ? ((totalRating / totalAnswers) * 10).toFixed(1) + " / 100"
    : "0 / 100";

  // ✅ Total time
  const totalSeconds = interviews.reduce((sum, interview) => {
    const timeStr = interview.time_taken || "00:00";
    const [mm, ss] = timeStr.split(":").map(Number);
    const minutes = isNaN(mm) ? 0 : mm;
    const seconds = isNaN(ss) ? 0 : ss;
    return sum + minutes * 60 + seconds;
  }, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const totalTime = `${hours}h ${minutes}m ${seconds}s`;

  // ✅ Chart data
  const chartMap = new Map();
  answers.forEach((ans) => {
    const date = (ans.createdAt || "").split(" ")[0];
    const rating = parseFloat(ans.rating ?? "0");

    if (!chartMap.has(date)) {
      chartMap.set(date, []);
    }
    chartMap.get(date).push(rating);
  });
  const chartData = Array.from(chartMap.entries()).map(([date, ratings]) => {
    return {
      date,
      rating: ratings.reduce((sum, val) => sum + val, 0) / ratings.length,
    };
  });

  const stats = {
    totalInterviews,
    avgScore,
    totalTime,
  };
  
  return (
    <div className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          📊 Your Interview Summary
        </h3>
        <DashboardStats stats={stats} chartData={chartData} />
      </div>
    </div>
  );
}
