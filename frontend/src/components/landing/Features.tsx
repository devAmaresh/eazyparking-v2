import { motion, useInView } from "framer-motion";
import { features, Feature } from "../../utils/features";
import { useRef } from "react";

export default function Features() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="features"
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-950 relative overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0  bg-center opacity-[0.01] dark:opacity-[0.02]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/40 to-violet-50/40 dark:from-blue-950/20 dark:to-violet-950/20 opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4 border border-indigo-200 dark:border-indigo-800/50">
            Smart Parking Features
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold pb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 text-transparent bg-clip-text"
          >
            Intelligent Parking Solutions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto"
          >
            Cutting-edge technology that revolutionizes how you find and secure
            parking spaces
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature: Feature, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="h-full"
            >
              {/* Light mode card */}
              <div className="group h-full bg-white dark:hidden border border-slate-200 hover:border-indigo-300 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-indigo-100/40 transition-all duration-300 overflow-hidden relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10"></div>

                <div className="text-5xl mb-6 text-indigo-600 relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-blue-100/50 to-indigo-100/50 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">{feature.icon}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 text-slate-900 group-hover:text-indigo-700 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-indigo-600 text-sm font-medium">
                    Learn more
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-indigo-600"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Dark mode card */}
              <div className="group h-full bg-slate-900 hidden dark:block border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10"></div>

                <div className="text-5xl mb-6 text-white relative">
                  <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">{feature.icon}</span>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-indigo-300 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {feature.description}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-indigo-400 text-sm font-medium">
                    Learn more
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-indigo-400"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-8 py-3 rounded-full shadow-lg shadow-blue-500/10 dark:shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-600/30 transition-all duration-300">
              <span className="flex items-center gap-2">
                Explore All Features
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
