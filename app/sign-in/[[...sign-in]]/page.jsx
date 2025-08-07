import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side (visible only on desktop) */}
      <div
        className="hidden md:flex md:w-1/2 min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/ai-interview-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-end items-center text-center p-6 w-full">
          <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
            Let's Begin Your Interview Journey
          </h1>
          <p className="text-white text-sm md:text-base max-w-md">
            Enhance your interview skills with AI-driven mock interviews, real-time feedback, and personalized insights to help you succeed.
          </p>
        </div>
      </div>

      {/* Right side: Gradient background + SignIn form */}
      <div className="w-full md:w-1/2 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 sm:p-6">
        {/* No extra bg-white wrapper */}
        <SignIn redirectUrl="/dashboard" />
      </div>
    </div>
  );
}
