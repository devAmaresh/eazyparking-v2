import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function UserActions() {
  const steps = [
    {
      number: "1",
      title: "Create Account",
      description: "Sign up in less than 2 minutes and set up your profile",
      button: "Create Account",
    },
    {
      number: "2",
      title: "Book Slot",
      description: "Find and reserve your perfect parking spot in seconds",
      button: "Find Parking",
    },
    {
      number: "3",
      title: "Make Payment",
      description: "Pay securely online or when you arrive at the location",
      button: "Payment Options",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] opacity-[0.015] dark:opacity-[0.03]"></div>
      </div>

      {/* Accent circles */}
      <div className="absolute -left-20 top-40 w-80 h-80 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px] -z-5"></div>
      <div className="absolute -right-20 bottom-40 w-80 h-80 bg-violet-200/20 dark:bg-violet-900/10 rounded-full filter blur-[100px] -z-5"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800/50">
            Simple 3-step process
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent"
          >
            Get Started in Minutes
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Just three simple steps to transform your parking experience forever
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 relative">
          {/* Connection line between steps */}
         

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
              className="relative z-10"
            >
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 h-full shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col">
                <div className="flex items-center mb-6 relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                    {step.number}
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 flex-grow">
                  {step.description}
                </p>

                <Button
                  className={`
                    w-full rounded-xl py-6 font-medium text-white shadow-md hover:shadow-lg transition-all
                    ${
                      index === 0
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        : index === 1
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                        : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                    }
                    dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600
                  `}
                >
                  <span className="flex items-center justify-center gap-2">
                    {step.button}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
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
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 py-2 px-4 rounded-full text-sm">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-blue-500"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Average setup time is less than 5 minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
