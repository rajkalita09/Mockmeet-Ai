import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center relative px-4 py-10 flex justify-center"
      style={{ backgroundImage: "url('/ai-interview-bg.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* SignUp form */}
      <div className="relative z-10 w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
}
