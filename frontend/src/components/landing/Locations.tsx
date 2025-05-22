import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, MapPin, Building } from "lucide-react";
import { cities, City } from "../../utils/cities";

interface LocationsProps {
  currentCityIndex: number;
  setCurrentCityIndex: React.Dispatch<React.SetStateAction<number>>;
}

export default function Locations({ currentCityIndex, setCurrentCityIndex }: LocationsProps) {
  const nextCity = (): void => setCurrentCityIndex((prevIndex) => (prevIndex + 1) % cities.length);
  const prevCity = (): void => setCurrentCityIndex((prevIndex) => (prevIndex - 1 + cities.length) % cities.length);
  
  const containerRef = useRef(null);
  
  // Add parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], ["5%", "0%", "-5%"]);

  return (
    <section 
      id="locations" 
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-950 relative overflow-hidden"
    >
      {/* Background elements with parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-[0.015] dark:opacity-[0.03]"></div>
        <div className="absolute top-20 left-0 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-20 right-0 w-80 h-80 bg-violet-200/20 dark:bg-violet-900/10 rounded-full filter blur-[100px]"></div>
      </motion.div>
      
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }} 
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800/50">
            Find parking nearby
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent">Available Locations</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find convenient parking spots in these major cities and more
          </p>
        </motion.div>
        
        <motion.div 
          style={{ y: contentY }}
          className="relative"
        >
          <div className="overflow-hidden px-4 sm:px-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 0.5 }}
              className="flex justify-center"
            >
              <div className="relative w-full max-w-5xl">
                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl dark:shadow-blue-500/5 border border-gray-100 dark:border-gray-800">
                  <div className="grid md:grid-cols-2 h-full">
                    <div className="relative h-[250px] md:h-[450px]">
                      <img 
                        src={cities[currentCityIndex].image || "/placeholder.svg"} 
                        alt={cities[currentCityIndex].name} 
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent"></div>
                      
                      <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-sm font-medium flex items-center space-x-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{cities[currentCityIndex].rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                          {cities[currentCityIndex].name}
                        </h3>
                        <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                          <MapPin size={16} className="mr-1 text-blue-500 dark:text-blue-400" />
                          <span className="text-sm">{cities[currentCityIndex].address}</span>
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <p className="font-semibold text-gray-900 dark:text-white flex items-center">
                            <Building size={18} className="mr-2 text-blue-500 dark:text-blue-400" />
                            Featured Parking Locations
                          </p>
                          <ul className="space-y-2.5">
                            {cities[currentCityIndex].parkingLots.map((lot: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs mr-2 mt-0.5">
                                  {index + 1}
                                </span>
                                <span className="text-gray-700 dark:text-gray-300">{lot}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 dark:from-blue-500 dark:to-violet-500 text-white rounded-full py-3 font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10 transition-all"
                      >
                        View Parking Options
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <button 
            onClick={prevCity} 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 z-10 transition-all" 
            aria-label="Previous city"
          >
            <ChevronLeft size={20} className="text-gray-800 dark:text-gray-200" />
          </button>
          <button 
            onClick={nextCity} 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-800 z-10 transition-all" 
            aria-label="Next city"
          >
            <ChevronRight size={20} className="text-gray-800 dark:text-gray-200" />
          </button>
          
          <div className="flex justify-center mt-8 space-x-2">
            {cities.map((_: City, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentCityIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentCityIndex 
                    ? "bg-blue-600 dark:bg-blue-400 w-6" 
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}