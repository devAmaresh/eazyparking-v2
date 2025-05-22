import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-black dark:to-slate-950">
      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/subtle-grid.svg')] bg-center opacity-[0.01] dark:opacity-[0.02]"></div>
        <div className="absolute -right-32 top-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute -left-32 bottom-0 w-96 h-96 bg-violet-100/30 dark:bg-violet-900/10 rounded-full filter blur-3xl opacity-60"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-800/50">
            Get Started Today
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent"
          >
            Transform Your Parking Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of users who have simplified their parking with our
            intelligent platform. Save time and eliminate parking stress.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Button
              asChild
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 dark:from-blue-500 dark:to-violet-500 dark:hover:from-blue-600 dark:hover:to-violet-600 text-white rounded-full px-8 py-6 text-lg font-medium shadow-lg shadow-blue-500/20 dark:shadow-blue-700/20 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-700/30 transition-all duration-300"
            >
              <Link to="/register" className="flex items-center gap-2">
                Create Free Account
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
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full px-8 py-6 text-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-300"
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-green-500"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="currentColor"
              />
            </svg>
            <span>No credit card required • Free plan available</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}