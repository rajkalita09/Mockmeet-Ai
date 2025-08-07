"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  ShieldCheck,
  UserCircle,
  BrainCog,
  Microscope,
  BarChart4,
  Languages,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const aboutRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  const scrollTo = (ref) => {
    ref?.current?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  
  return (
    <div className="min-h-screen scroll-smooth relative text-gray-900">
      {/* Header */}
      <header className="w-full p-4 bg-white flex items-center justify-between fixed top-0 z-20 shadow-md">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={100}
          height={50}
          className="rounded-full"
        />
        <div
          className="md:hidden flex flex-col space-y-1 cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-[2px] bg-gray-800 rounded"></div>
          <div className="w-6 h-[2px] bg-gray-800 rounded"></div>
          <div className="w-6 h-[2px] bg-gray-800 rounded"></div>
        </div>
        <nav
          className={`md:flex space-x-4 text-sm font-medium text-gray-700 items-center ${menuOpen ? "flex flex-col absolute top-16 left-0 w-full bg-white p-4 space-y-3" : "hidden"
            }`}
        >
          <button
            onClick={() => scrollTo(featuresRef)}
            className="hover:text-indigo-600 transition"
          >
            Features
          </button>
          <button
            onClick={() => scrollTo(aboutRef)}
            className="hover:text-indigo-600 transition"
          >
            About Us
          </button>
          <button
            onClick={() => scrollTo(contactRef)}
            className="hover:text-indigo-600 transition"
          >
            Contact Us
          </button>

          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline" className="text-sm">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Top Section */}
      <section className="pt-32 pb-20 flex flex-col items-center text-center px-6 bg-white relative z-10">
        <motion.h1
          className="text-5xl font-bold leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-indigo-600">Mockmeet-Ai</span>
        </motion.h1>
        <motion.p
          className="mt-4 text-xl text-gray-600 max-w-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Practice job interviews with our AI. Get live feedback on your answers and build confidence!
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/dashboard">
            <Button className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 text-white text-lg rounded-xl shadow-md">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Wave */}
      <div className="relative z-0 -mt-2">
        <svg className="w-full h-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#a855f7" d="M0,288L80,272C160,256,320,224,480,213.3C640,203,800,213,960,208C1120,203,1280,181,1360,170.7L1440,160V320H0Z" />
        </svg>
      </div>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="min-h-screen px-6 py-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 text-white relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto text-center space-y-16">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Use Mockmeet-Ai?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 text-white mx-auto mb-4 shadow-md">
              <Languages className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-center">Bilingual Interview Support</h3>
            <p className="text-sm text-white/90 leading-relaxed text-center">
              Whether you are fluent in <strong>English</strong> or feel like interacting in <strong>Hindi</strong>, our Mockmeet-Ai covers both languages for that extra personalized touch. Speak fluently in the language you love and learn from the feedback tailored for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[{
              title: "Realistic Experience",
              desc: "Simulates real-time interviews with dynamic questions and a professional setup to boost your confidence.",
              Icon: BrainCog,
            },
            {
              title: "Live AI Feedback",
              desc: "Get instant and intelligent analysis of your tone, content, and delivery — powered by state-of-the-art AI.",
              Icon: Microscope,
            },
            {
              title: "Grow With Practice",
              desc: "Track your progress, identify weak points, and improve steadily with every round.",
              Icon: BarChart4,
            }].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 text-white mx-auto mb-4 shadow-md">
                  <feature.Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/90 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Transition */}
      <div className="relative z-0 -mt-2">
        <svg className="w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#10b981" d="M0,224L60,229.3C120,235,240,245,360,245.3C480,245,600,235,720,224C840,213,960,203,1080,192C1200,181,1320,171,1380,165.3L1440,160V320H0Z" />
        </svg>
      </div>

      {/* About Section */}
      <section ref={aboutRef} className="px-6 py-20 bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 text-white relative z-10">
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(34,197,94,0.3)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 border shadow-xl rounded-3xl p-10 max-w-5xl mx-auto text-left text-gray-800 backdrop-blur-lg"
        >
          <h2 className="text-4xl font-bold text-green-700 mb-6 flex items-center gap-3">
            <UserCircle className="w-9 h-9 text-green-700" />
            About Us
          </h2>
          <p className="leading-relaxed text-lg font-medium text-gray-700">
            <span className="block mb-4">
              This platform is developed by <strong style={{ color: 'blue' }}>Raj Kalita</strong>, a passionate Data Science and AI student.  It offers realistic mock interviews with instant AI feedback to help candidates build confidence.
            </span>
            <span className="block mb-4">
              Designed to make interview preparation stress-free and effective — no pressure, no judgments.
              Just you, your skills, and our AI helping you shine.
            </span>
            
            <span>
               Your <strong style={{ color: 'green' }}>Data Privacy</strong> matters. All your responses and feedback are encrypted, stored securely,
              and never shared with third parties.
            </span>
          </p>
        </motion.div>
      </section>

      {/* Contact Section Transition Wave */}
      <div className="relative z-0 -mt-6">
        <svg className="w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#06b6d4" d="M0,224L60,229.3C120,235,240,245,360,245.3C480,245,600,235,720,224C840,213,960,203,1080,192C1200,181,1320,171,1380,165.3L1440,160V320H0Z" />
        </svg>
      </div>

      {/* Contact Us Section */}
      <section ref={contactRef} className="px-6 py-20 bg-gradient-to-br from-sky-500 via-cyan-600 to-emerald-600 text-white relative">
        <motion.div
          whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(56,189,248,0.3)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl p-10 shadow-2xl border border-white/20 transition-all duration-300"
        >
          <h2 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-yellow-300" />
            Contact Us
          </h2>
          <p className="text-lg mb-6 text-white/90">
            Reach out for support, suggestions or collaboration!
          </p>
          <div className="flex items-center gap-3 mb-2">
            <Instagram className="w-6 h-6 text-pink-300" />
            <a
              href="https://www.instagram.com/rajkalita_09"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-200 transition"
            >
              @rajkalita_09
            </a>
          </div>
          <p className="text-sm text-white/70">We'll get back to you as soon as possible.</p>
        </motion.div>
      </section>

      {/* Footer Wave */}
      <div className="relative z-0 -mt-6">
        <svg className="w-full h-24" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#7c3aed" d="M0,224L60,229.3C120,235,240,245,360,245.3C480,245,600,235,720,224C840,213,960,203,1080,192C1200,181,1320,171,1380,165.3L1440,160V320H0Z" />
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 text-white text-center py-6">
        <p className="text-sm font-medium">© 2025 Mockmeet-Ai. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
