"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  MessageCircle, 
  Users,
  CheckCircle
} from "lucide-react";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [autoplay, setAutoplay] = useState(true);
  
  // Autoplay functionality
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [autoplay]);
  
  // Navigation functions
  const next = () => {
    setAutoplay(false); // Disable autoplay on manual navigation
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prev = () => {
    setAutoplay(false); // Disable autoplay on manual navigation
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const goToTestimonial = (index: number) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-white to-blue-50/30 dark:from-black dark:to-blue-950/10 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
             style={{
               backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
               backgroundSize: '40px 40px'
             }}
        ></div>
        
        {/* Gradient blobs */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full filter blur-[100px]"></div>
        
        {/* Extra decorative elements */}
        <div className="absolute top-20 left-20 w-12 h-12 rounded-lg border border-blue-200/50 dark:border-blue-800/30 rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-20 right-40 w-16 h-16 rounded-full border border-indigo-200/50 dark:border-indigo-800/30 hidden lg:block"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800/30">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Customer Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            What Our Users Say
          </h2>
          
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto">
            Discover how EazyParking has transformed the parking experience for thousands of satisfied customers
          </p>
        </motion.div>
        
        {/* Featured testimonial carousel */}
        <div className="mb-20 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative"
              >
                {/* Quote mark decoration */}
                <div className="absolute -left-4 -top-4 md:-left-8 md:-top-8 text-blue-100 dark:text-blue-900/50">
                  <Quote className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1} />
                </div>
                
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 md:p-10 shadow-xl border border-blue-100 dark:border-blue-900/30 relative z-10">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* User avatar */}
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full opacity-70 blur-sm"></div>
                      <div className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800">
                        <img 
                          src={`https://randomuser.me/api/portraits/${testimonials[currentIndex].gender}/${20 + currentIndex}.jpg`} 
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      {/* Stars */}
                      <div className="mb-4 flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className="fill-amber-400 text-amber-400" 
                          />
                        ))}
                      </div>
                      
                      {/* Quote */}
                      <blockquote className="mb-6">
                        <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-200 italic leading-relaxed">
                          "{testimonials[currentIndex].quote}"
                        </p>
                      </blockquote>
                      
                      {/* User info */}
                      <div className="flex justify-between items-end">
                        <div>
                          <h4 className="text-xl font-bold text-zinc-900 dark:text-white">
                            {testimonials[currentIndex].name}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400">
                            {testimonials[currentIndex].title}
                          </p>
                        </div>
                        
                        {/* Verified badge */}
                        <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full text-xs text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/30">
                          <CheckCircle className="h-3 w-3" />
                          <span>Verified User</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation controls */}
            <div className="flex justify-between mt-8">
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToTestimonial(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentIndex === idx 
                        ? "bg-blue-600 dark:bg-blue-400 w-8" 
                        : "bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              
              <div className="flex gap-3">
                <motion.button 
                  onClick={prev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button 
                  onClick={next}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white dark:bg-zinc-800 border border-blue-100 dark:border-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  aria-label="Next testimonial"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats and trust indicators */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mb-16"
        >
          {[
            { number: "15K+", label: "Active Users", icon: <Users className="h-4 w-4" /> },
            { number: "50+", label: "Locations", icon: <MapPin className="h-4 w-4" /> },
            { number: "4.9", label: "Average Rating", icon: <Star className="h-4 w-4" /> },
            { number: "99%", label: "Satisfaction Rate", icon: <CheckCircle className="h-4 w-4" /> }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 shadow-sm text-center"
            >
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Multiple testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.filter((_, idx) => idx !== currentIndex).slice(0, 3).map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-md"
            >
              {/* Stars */}
              <div className="mb-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className="fill-amber-400 text-amber-400" 
                  />
                ))}
              </div>
              
              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed line-clamp-4">
                  "{testimonial.quote}"
                </p>
              </blockquote>
              
              {/* User */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden">
                  <img 
                    src={`https://randomuser.me/api/portraits/${testimonial.gender}/${40 + idx}.jpg`}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h5 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">{testimonial.name}</h5>
                  <p className="text-xs text-blue-600 dark:text-blue-400">{testimonial.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Final CTA */}
        <div className="mt-16 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-full shadow-lg shadow-blue-500/20 transition-all duration-200 border border-blue-700/10"
          >
            <Users className="h-4 w-4" />
            <span>Join Thousands of Happy Customers</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

// Component for map pin icon
const MapPin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

// Testimonials data
const testimonials = [
  {
    quote:
      "EazyParking has completely streamlined our parking operations. We used to deal with manual logs and frustrated customers—now everything is automated, efficient, and seamless.",
    name: "Anita Verma",
    title: "Facility Manager, Urban Mall",
    gender: "women",
  },
  {
    quote:
      "I love how easy it is to find and book a parking spot now. The real-time availability and quick payments save me so much time during my daily commute.",
    name: "Rohan Desai",
    title: "Daily Commuter, Pune",
    gender: "men",
  },
  {
    quote:
      "Our team was able to onboard in minutes. The admin dashboard gives us total control over every spot, and the reporting tools are a game changer.",
    name: "Sandeep Mehra",
    title: "Operations Head, SmartPark Pvt. Ltd.",
    gender: "men",
  },
  {
    quote:
      "I used to circle for 20+ minutes looking for parking. With EazyParking, I find, reserve, and park in under five. It's a must-have for every driver in the city.",
    name: "Mehak Kapoor",
    title: "App User & Freelancer",
    gender: "women",
  },
  {
    quote:
      "EazyParking has helped us reduce congestion and improve traffic flow near our commercial complex. It's a smart solution with a real impact.",
    name: "Rajeev Iyer",
    title: "City Planner, Navi Mumbai",
    gender: "men",
  },
];
