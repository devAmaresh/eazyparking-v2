"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  // Navigation functions
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0  bg-center opacity-[0.01] dark:opacity-[0.02]"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-violet-200/20 dark:bg-violet-900/10 rounded-full filter blur-[80px]"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800/50">
            What Our Users Say
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
            Trusted by Thousands
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their parking experience
          </p>
        </motion.div>
        
        {/* Featured testimonial */}
        <div className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 md:p-10 shadow-xl dark:shadow-slate-900/10 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                  <img 
                    src={`https://randomuser.me/api/portraits/${testimonials[currentIndex].gender}/${20 + currentIndex}.jpg`} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="mb-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className="fill-yellow-400 text-yellow-400" 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="mb-6">
                    <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 italic">
                      "{testimonials[currentIndex].quote}"
                    </p>
                  </blockquote>
                  
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      {testimonials[currentIndex].title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation controls */}
            <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={prev}
                className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={next}
                className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Infinite scroll testimonials */}
        <div className="pt-8 pb-10">
          <h3 className="text-center text-xl font-medium text-slate-800 dark:text-slate-200 mb-12">
            Trusted by thousands of users worldwide
          </h3>
          
          <div className="h-[200px] w-full">
            <InfiniteMovingCards
              items={testimonials}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Updated testimonials with gender field for avatar images
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
