"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    console.log(path);
  }, [path]);

  const handleNavigation = (targetPath) => {
    setMenuOpen(false);
    router.push(targetPath);
  };

  const navItems = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Previous Interviews", path: "/dashboard/PreviousInterviews" },
    { title: "How it Works?", path: "/dashboard/HowitWorks" },
    { title: "About Us", path: "/dashboard/AboutUs" },
  ];

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm relative">
      {/* Left Side (Mobile Hamburger + Logo) */}
      <div className="flex items-center space-x-3">
        {/* Hamburger Button for Mobile */}
        <div className="md:hidden flex items-center justify-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 focus:outline-none"
            aria-label="Menu Toggle"
          >
            {menuOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <Menu className="w-7 h-7" />
            )}
          </button>
        </div>
        <Image src="/logo.jpg" width={160} height={100} alt="logo" />
      </div>

      {/* Links for Desktop */}
      <ul className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <li
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
              ${path === item.path ? "text-primary font-bold" : ""}`}
          >
            {item.title}
          </li>
        ))}
      </ul>

      {/* User Button */}
      <UserButton />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-secondary flex flex-col items-start p-4 rounded-b-xl shadow-lg">
          {navItems.map((item) => (
            <div
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full p-3 rounded-lg hover:text-primary hover:font-bold cursor-pointer 
                ${path === item.path ? "text-primary font-bold" : ""}`}
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
