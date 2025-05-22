import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { TextGenerateEffect, TextGenerateEffectFast } from "../ui/text-generate-effect";

export default function Hero() {
  return (
    <section className="py-[125px] relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-950">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/subtle-grid.svg')] bg-center opacity-[0.01] dark:opacity-[0.02]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-200/20 dark:bg-violet-900/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Text content */}
          <div className="w-full md:w-3/5 space-y-8 md:pr-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/50 shadow-sm"
            >
              Reimagining Urban Parking
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1]"
            >
              <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent pb-2">
                Book Your Spot
              </span>
              <br />
              <div className="relative">
                <TextGenerateEffect 
                  className="text-slate-800 dark:text-white"
                  words="Park with Ease."
                />
                <div className="absolute -bottom-2 left-0 h-1 w-24 bg-gradient-to-r from-blue-500 to-violet-500 dark:from-blue-400 dark:to-violet-400 rounded-full"></div>
              </div>
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <TextGenerateEffectFast 
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl"
                words="The smart way to find and book parking spaces in your city. No more circling blocks or stressing over spots."
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-5 pt-4"
            >
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 dark:from-blue-500 dark:via-indigo-500 dark:to-violet-500 text-white rounded-full px-8 py-7 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 font-medium text-base"
              >
                <Link to="/register" className="flex items-center gap-2">
                  Create Account
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-full px-8 py-7 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300 text-base"
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-4 pt-4"
            >
              <div className="flex -space-x-3">
                { [
                  "bg-gradient-to-br from-cyan-400 to-blue-500 dark:from-cyan-500 dark:to-blue-600",
                  "bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600",
                  "bg-gradient-to-br from-emerald-400 to-green-500 dark:from-emerald-500 dark:to-green-600",
                  "bg-gradient-to-br from-rose-400 to-pink-500 dark:from-rose-500 dark:to-pink-600",
                ].map((bgColor, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + i * 0.1 }}
                    className={`w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 ${bgColor} flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                  >
                    {String.fromCharCode(65 + i)}
                  </motion.div>
                )) }
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="text-sm text-slate-600 dark:text-slate-300"
              >
                <span className="font-bold">4,000+</span> customers trust EazyParking
              </motion.p>
            </motion.div>
          </div>
          
          {/* Visual content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full md:w-2/5 relative"
          >
            <div className="relative">
              {/* Main visual */}
              <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border border-white/20 dark:border-slate-800/20">
                <img
                  src="https://img.freepik.com/premium-photo/car-parked-designated-spot_1375194-69289.jpg?w=2000"
                  alt="Parking Management System"
                  className="object-cover w-full h-full filter saturate-[1.1] contrast-[1.05] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Overlay card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 z-10"
                >
                  <div className="bg-black/30 backdrop-blur-xl rounded-xl p-5 border border-white/10 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-md shadow-green-400/50"></div>
                      <p className="text-sm font-medium text-white">Live Parking Status</p>
                    </div>
                    <p className="text-xl font-bold text-white mb-1">Smart Parking Solutions</p>
                    <p className="text-sm text-white/80 mb-3">For businesses and individuals</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap gap-2">
                        {["Real-time", "Secure", "AI-powered"].map((tag, i) => (
                          <div key={i} className="bg-white/20 hover:bg-white/30 transition-colors px-3 py-1 rounded-full text-xs font-medium text-white">
                            {tag}
                          </div>
                        ))}
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-blue-500/80 hover:bg-blue-500 flex items-center justify-center transition-colors cursor-pointer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                          <path d="M12 8L18 14L12 20M6 8L12 14L6 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 -z-10 w-24 h-24 bg-blue-200/30 dark:bg-blue-800/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-6 -z-10 w-32 h-32 bg-violet-200/30 dark:bg-violet-800/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
