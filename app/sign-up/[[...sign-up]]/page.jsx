import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-center relative" 
         style={{ backgroundImage: "url('/ai-interview-bg.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4"></h1>
        <SignUp />
      </div>
    </div>
  );
}
