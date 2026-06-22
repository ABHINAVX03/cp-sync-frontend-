import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/common/Hero";
import Stats from "@/components/common/Stats";
import Features from "@/components/common/Features";
import HowItWorks from "@/components/common/HowItWorks";
import Footer from "@/components/layout/Footer";
import RequestAccess from "@/components/common/RequestAccess";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <RequestAccess />  
      </main>
      <Footer />
    </div>
  );
}