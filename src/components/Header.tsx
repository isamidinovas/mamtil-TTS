"use client";

import { Mic, Github } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-2xl md:text-3xl font-bold text-white tracking-tight hover:text-purple-300 transition-colors flex items-center gap-3"
          >
            <Mic className="h-8 w-8" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-300">
              Мамтил TTS
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
