"use client";

import { Music, ArrowRight } from "lucide-react";
import { useChat } from "ai/react";
import { Message } from "ai";
import { leapfrog } from "ldrs";

export default function Home() {
  const {
    input,
    append,
    isLoading,
    messages,
    handleSubmit,
    handleInputChange,
  } = useChat();

  leapfrog.register();

  const isMessage = false;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative bg-black p-4 rounded-full">
                <Music className="h-12 w-12 text-slate-600" />
              </div>
            </div>
            <h1 className="ml-4 text-6xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-600 text-transparent bg-clip-text">
              RiffBot
            </h1>
          </div>
          {isMessage ? (
            <>
              <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
                Your AI-powered music companion. Create, compose, and explore
                music like never before.
              </p>
            </>
          ) : (
            <>
              {isLoading && (
                <l-leapfrog size="40" speed="2.5" color="white"></l-leapfrog>
              )}
            </>
          )}
        </div>

        {/* Input Section */}
        <div className="mt-80 max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-indigo-800 rounded-full blur opacity-75"></div>
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask RiffBot anything about music..."
                className="w-full px-6 py-4 bg-black/90 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        {/* <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Bot className="h-6 w-6" />}
            title="AI-Powered Analysis"
            description="Get instant musical insights and recommendations powered by advanced AI"
          />
          <FeatureCard
            icon={<Music className="h-6 w-6" />}
            title="Music Generation"
            description="Create unique melodies and harmonies with intelligent composition tools"
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Smart Learning"
            description="Learn music theory and techniques through interactive AI guidance"
          />
        </div> */}
      </div>
    </main>
  );
}
