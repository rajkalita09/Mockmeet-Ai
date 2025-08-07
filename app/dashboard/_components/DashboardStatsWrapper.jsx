import { db } from "@/utils/db";
import { UserAnswer, MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import DashboardStats from "./DashboardStats"; // 👈 this is your chart UI

export default async function DashboardStatsWrapper() {
  const user = await currentUser();
  if (!user) {
    return <div className="text-center text-red-500 p-4">Please sign in.</div>;
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  const interviews = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, userEmail));
  const totalInterviews = interviews.length;

  const answers = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.userEmail, userEmail));
  const totalAnswers = answers.length;

  const totalRating = answers.reduce(
    (sum, ans) => sum + parseFloat(ans.rating ?? "0"),
    0
  );
  const avgScore = totalAnswers
    ? ((totalRating / totalAnswers) * 10).toFixed(1) + " / 100"
    : "0 / 100";

  const totalSeconds = interviews.reduce((sum, interview) => {
    const timeStr = interview.time_taken || "00:00";
    const [mm, ss] = timeStr.split(":").map(Number);
    return sum + (isNaN(mm) ? 0 : mm) * 60 + (isNaN(ss) ? 0 : ss);
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const totalTime = `${hours}h ${minutes}m ${seconds}s`;

  const chartMap = new Map();
  answers.forEach((ans) => {
    const date = (ans.createdAt || "").split(" ")[0];
    const rating = parseFloat(ans.rating ?? "0");

    if (!chartMap.has(date)) chartMap.set(date, []);
    chartMap.get(date).push(rating);
  });

  const chartData = Array.from(chartMap.entries()).map(([date, ratings]) => ({
    date,
    rating: ratings.reduce((sum, val) => sum + val, 0) / ratings.length,
  }));

  const stats = { totalInterviews, avgScore, totalTime };

  return (
    <DashboardStats stats={stats} chartData={chartData} />
  );
}
