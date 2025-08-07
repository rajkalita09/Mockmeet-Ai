import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row">
      {/* Left side with background image */}
      <div className="hidden md:flex md:w-1/2 h-full bg-cover bg-center relative" 
           style={{ backgroundImage: "url('/ai-interview-bg.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 flex flex-col justify-end items-center w-full text-center p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Let's Begin Your Interview Journey</h1>
          <p className="text-white text-lg max-w-md">Enhance your interview skills with AI-driven mock interviews, real-time feedback, and personalized insights to help you succeed.</p>
        </div>
      </div>
      
      {/* Right side with SignIn form and colorful background */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <SignIn redirectUrl="/dashboard" />  
        </div>
      </div>
    </div>
  );
}
