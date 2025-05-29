import Image from "next/image";
import Link from "next/link";
import CountdownTimer from "@/components/CountdownTimer";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Home() {
  // Set the target date for the countdown
  const targetDate = new Date("July 2, 2025 09:00:00");
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative">
      {/* Animated background */}
      <AnimatedBackground />
      
      <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center z-10 gap-12">
        {/* TM Logo */}
        <div className="mb-8 animate-float">
          <Image
            src="/tm-logo.png"
            alt="TM Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        
        {/* Hero title */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-4">
          <span className="bg-gradient-to-r from-tm-blue to-tm-orange bg-clip-text text-transparent">
            TM AI Day 2025
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto mb-12">
          Join us for an exciting day of AI innovation, insights, and interactive experiences
        </p>
        
        {/* Countdown timer */}
        <div className="w-full max-w-2xl mx-auto">
          <CountdownTimer targetDate={targetDate} />
        </div>
        
        {/* CTA buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-12">
          <Link 
            href="/chat/login" 
            className="ios-button bg-gradient-to-r from-tm-blue to-tm-orange text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold text-lg"
          >
            Chat with AI
          </Link>
          
          <a 
            href="#details" 
            className="ios-button bg-white/10 backdrop-blur-lg border border-white/20 py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-lg"
          >
            Learn More
          </a>
        </div>
      </div>
      
      {/* Event details section */}
      <section id="details" className="w-full bg-white/5 backdrop-blur-sm py-20 mt-12 z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-effect rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-tm-blue to-tm-blue/70 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Event Date</h3>
            <p>July 2, 2025</p>
            <p>9:00 AM - 5:00 PM</p>
          </div>
          
          {/* Card 2 */}
          <div className="glass-effect rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-tm-orange to-tm-orange/70 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Location</h3>
            <p>TM Headquarters</p>
            <p>Kuala Lumpur, Malaysia</p>
          </div>
          
          {/* Card 3 */}
          <div className="glass-effect rounded-2xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-tm-blue to-tm-orange flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Features</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Interactive AI Demos</li>
              <li>Expert Speakers</li>
              <li>Networking Opportunities</li>
              <li>AI Showcases</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-tm-dark-blue to-tm-dark-orange text-white py-8 z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Image
              src="/tm-logo-white.png"
              alt="TM Logo"
              width={120}
              height={48}
            />
          </div>
          <div className="text-center md:text-right">
            <p>© 2025 Telekom Malaysia Berhad. All rights reserved.</p>
            <p className="text-sm opacity-75 mt-1">Empowering Malaysia's Digital Future</p>
          </div>
        </div>
      </footer>
    </main>
  );
}