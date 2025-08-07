"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAiModal";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [jobPosition, setJobPosition] = React.useState("");
  const [jobDesc, setJobDesc] = React.useState("");
  const [jobExperience, setJobExperience] = React.useState("");
  const [language, setLanguage] = React.useState("english");
  const [loading, setLoading] = React.useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const inputPrompt = `
You are an expert interviewer AI. Based on the following details:

- Job Role: ${jobPosition}
- Description: ${jobDesc}
- Experience: ${jobExperience} years

Generate exactly 5 interview questions AND detailed answers in the following strict JSON format:

[
  {
    "question": "Your question here",
    "answer": "Your detailed answer here"
  }
]

IMPORTANT:
- Respond ONLY with the JSON array.
- Do not include any extra or introductory text.
- The language must be "${language === "hindi" ? "Hindi" : "English"}".
`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();

      const cleaned =
        responseText.match(/```json([\s\S]*?)```/)?.[1]?.trim() ||
        responseText.trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error("❌ Failed to parse JSON. Aborting DB insert.");
        return;
      }

      const mockId = uuidv4();

      const response = await db
        .insert(MockInterview)
        .values({
          mockId,
          language,
          jobPosition,
          jobDesc,
          jobExperience,
          jsonMockResp: JSON.stringify(parsed),
          createdBy: user?.primaryEmailAddress?.emailAddress || "anonymous",
          createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        })
        .returning({ mockId: MockInterview.mockId });

      if (response?.[0]?.mockId) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${mockId}`);
      }
    } catch (error) {
      console.error("❌ Error sending message or inserting to DB:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Button */}
       <div
  className="mx-auto w-fit p-8 px-10 border rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-red-700 text-white hover:scale-105 hover:shadow-md cursor-pointer transition-all"
  onClick={() => setOpenDialog(true)}
>
  <h2 className="text-base text-center font-semibold">+ Add New Interview</h2>
</div>

      {/* Dialog Box */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-xl shadow-2xl px-8 py-10 transition-all"
        >
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-gray-800 mb-1">
              Start a New Interview
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 mb-6">
              Fill in the job details to generate AI-powered mock questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="flex flex-col gap-5 text-gray-700">
            {/* Language Selection */}
            <div>
              <label className="block mb-1 text-sm font-medium">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500 px-3 py-2 text-sm shadow-sm"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
              </select>
            </div>

            {/* Job Role */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Job Role / Position
              </label>
              <Input
                placeholder="e.g. Backend Developer"
                required
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setJobPosition(e.target.value)}
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Job Description
              </label>
              <Textarea
                placeholder="e.g. Build APIs, integrate databases, etc."
                required
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Years of Experience
              </label>
              <Input
                type="number"
                placeholder="e.g. 3"
                max="60"
                required
                className="rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setJobExperience(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 justify-end mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
