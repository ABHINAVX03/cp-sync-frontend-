import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/common/Hero";
import Stats from "@/components/common/Stats";
import Features from "@/components/common/Features";
import HowItWorks from "@/components/common/HowItWorks";
import Footer from "@/components/layout/Footer";
import RequestAccess from "@/components/common/RequestAccess";

export default function LandingPage() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <RequestAccess />

        {error === "not_approved" && !dismissed && (
          <div className="mx-auto max-w-lg px-6 mb-12">
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-5 py-4 flex items-center justify-between gap-3 text-sm text-yellow-400">
              <p>
                Your account hasn’t been approved yet. If you’ve already
                requested access, we’ll activate it soon. Otherwise, request
                access below.
              </p>
              <button
                onClick={() => setDismissed(true)}
                className="shrink-0 text-yellow-300 hover:text-white underline text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}