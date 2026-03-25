import React, { useEffect, useRef } from 'react';
import { 
  Zap, 
  Smartphone, 
  ShieldCheck, 
  Trophy,
  ArrowRight,
  MousePointer2,
  ChevronDown
} from 'lucide-react';

export const AboutUs: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] font-sans selection:bg-[#fb923c]/30 selection:text-[#fb923c] overflow-x-hidden">
      
      {/* 📖 PAGE 1: THE COVER */}
      <section className="relative min-h-screen flex flex-col items-center justify-between py-12 px-6 sm:px-12 bg-white">
        {/* Top Header */}
        <div className="w-full max-w-7xl flex justify-between items-start reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center rounded">
              <img src="/favicon.ico" alt="Logo" className="w-8 h-8 invert" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tighter uppercase letter-spacing-widest">FAIRYTAILVIETNAM</h2>
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.4em] uppercase">Premium Manga Experience</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Edition No. 01</p>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">March 2026</p>
          </div>
        </div>

        {/* Hero Image Block */}
        <div className="w-full max-w-7xl my-12 relative group reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-200">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-sm shadow-2xl relative">
            <img 
              src="/images/catalog_cover.png" 
              alt="Manga Guild HQ" 
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-in-out"
            />
            {/* Mission Statement Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-black/90 backdrop-blur-sm p-6 sm:p-10 flex flex-col sm:flex-row justify-between items-center text-white border-t border-white/10">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none mb-4 sm:mb-0 uppercase">
                Bridging the Gap Between <span className="text-orange-500">Storytelling</span> and <span className="text-blue-500">Technology</span>
              </h1>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-xs font-bold tracking-[0.3em] uppercase group-hover:mr-2 transition-all">Explore</span>
                <ArrowRight size={16} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 border-l-2 border-t-2 border-black/10 hidden lg:block"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 border-r-2 border-b-2 border-black/10 hidden lg:block"></div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 animate-bounce opacity-60">
          <span className="text-[10px] font-bold tracking-widest uppercase">Scroll to Open</span>
          <ChevronDown size={14} />
        </div>
      </section>

      {/* 📖 PAGE 2-3: THE SPREAD */}
      <section className="w-full bg-[#f8f9fa] py-24 px-6 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            
            {/* Left Page: Manifesto */}
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out">
              <span className="text-xs font-bold text-orange-500 uppercase tracking-[0.4em] mb-4 block underline decoration-2 underline-offset-8">Philosophy</span>
              <h2 className="text-5xl sm:text-7xl font-serif text-balance leading-[1.1] mb-8 text-[#1a1a1a]">
                A platform designed for the <span className="italic">soul</span> of readers.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed font-light mb-12">
                Fairy Tail Vietnam is not just a website; it is an editorial sanctuary for the art of Japanese manga. We combine the tactile feel of reading a high-quality volume with the blazing performance of modern web architecture. Our mission is to preserve the legacy of storytelling while pushing the boundaries of user experience.
              </p>
              
              <div className="relative rounded overflow-hidden shadow-xl mb-6 aspect-video">
                <img 
                  src="/images/catalog_designer.png" 
                  alt="Designer Workspace" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-[3000ms]"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Ref. Studio A-1</span>
                <span>Workspace Visualization</span>
              </div>
            </div>

            {/* Right Page: Excellence */}
            <div className="reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300 bg-white p-12 shadow-2xl rounded-sm border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
               
               <h3 className="text-3xl font-serif mb-10 text-[#1a1a1a]">Collaborating with <br/><span className="italic text-orange-500">Exceptional Talent</span></h3>
               
               <div className="space-y-12">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <img src="/images/catalog_concepts.png" alt="Concepts" className="w-full aspect-square object-cover rounded shadow-md" />
                    <div className="flex flex-col justify-center gap-4">
                      <div className="p-4 bg-gray-50 rounded group hover:bg-black transition-colors">
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Digital First</h4>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400">Optimized for every screen size and retina displays.</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded group hover:bg-black transition-colors">
                        <h4 className="text-sm font-bold uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Quality Control</h4>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400">AI-powered image upscaling for older chapter volumes.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { icon: Zap, label: "Efficiency", val: "20ms Response" },
                      { icon: Smartphone, label: "Accessibility", val: "Omni-device" },
                      { icon: ShieldCheck, label: "Security", val: "Military Grade" },
                      { icon: Trophy, label: "Community", val: "Leaderboard System" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-2">
                        <item.icon className="text-orange-500" size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                        <span className="text-xl font-black">{item.val}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 📖 PAGE 4: TECHNICAL AUDIT */}
      <section className="bg-black text-white py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-6xl font-serif leading-[1.1] mb-6">Technical precision at every single layer of the stack.</h2>
              <p className="text-gray-400 font-light text-lg">We use the most reliable technologies to ensure your reading experience is never interrupted. High uptime, low latency, and infinite scaling.</p>
            </div>
            <div className="flex gap-4">
               <button className="px-8 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Documentation</button>
               <button className="px-8 py-4 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all">Join Guild</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 reveal opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-200">
            {[
              { label: "Uptime", val: "99.9%" },
              { label: "HD Chapters", val: "500K+" },
              { label: "Active Users", val: "1.2M" },
              { label: "Latency", val: "<0.4s" }
            ].map((stat, i) => (
              <div key={i} className="bg-black py-16 px-8 flex flex-col items-center">
                <span className="text-7xl font-black tracking-tighter mb-4">{stat.val}</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 BACK COVER */}
      <footer className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-black flex items-center justify-center rounded-full mb-12 shadow-xl">
             <img src="/favicon.ico" alt="Logo" className="w-12 h-12 invert" />
          </div>
          <h2 className="text-4xl font-serif mb-6 italic">FAIRY TAIL GUILD</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.5em] mb-12">Vietnamese Fansub Edition 2026</p>
          
          <div className="w-full h-px bg-gray-100 mb-12"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 w-full max-w-4xl text-left">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Location</h4>
              <p className="text-sm font-bold">Magnolia City, Fiore<br/>Hanoi, Vietnam</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Contact</h4>
              <p className="text-sm font-bold">guild@fairytail.vn<br/>+84 (0) 900 777 888</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Digital</h4>
              <div className="flex gap-4 mt-2">
                <span className="text-xs font-bold hover:text-orange-500 cursor-pointer">FB</span>
                <span className="text-xs font-bold hover:text-orange-500 cursor-pointer">TW</span>
                <span className="text-xs font-bold hover:text-orange-500 cursor-pointer">IG</span>
                <span className="text-xs font-bold hover:text-orange-500 cursor-pointer">GH</span>
              </div>
            </div>
          </div>
          
          <p className="mt-24 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
            © 2026 Fairy Tail Vietnam. All Rights Reserved. Crafted with passion by Antigravity.
          </p>
        </div>
      </footer>

      {/* Custom Cursor Decoration - Desktop only */}
      <div className="hidden lg:flex fixed bottom-12 right-12 flex-col items-end gap-1 animate-pulse pointer-events-none">
        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Interactive Catalog v1.0</span>
        <div className="flex items-center gap-2">
           <MousePointer2 size={12} className="text-orange-500" />
           <span className="w-12 h-[1px] bg-gray-200"></span>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;
