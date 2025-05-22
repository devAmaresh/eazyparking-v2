import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function AdminPreview() {
  const containerRef = useRef(null);

  // Add parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const imageY = useTransform(scrollYProgress, [0, 0.5, 1], ["5%", "0%", "-5%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], ["-5%", "0%", "5%"]);

  return (
    <section
      ref={containerRef}
      className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black relative overflow-hidden"
    >
      {/* Background elements with parallax */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full filter blur-[100px]"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-violet-200/20 dark:bg-violet-900/10 rounded-full filter blur-[100px]"></div>
      </motion.div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Image Block with parallax */}
          <motion.div
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <div className="relative">
              {/* Main image with styling */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="https://img.freepik.com/free-photo/person-preparing-get-driver-license_23-2150167566.jpg?ga=GA1.1.111555767.1744038035&semt=ais_country_boost&w=740"
                    alt="Admin Dashboard"
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none"></div>

                {/* Floating UI element */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute bottom-6 left-6 right-6"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 shadow-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium text-sm">
                          Admin Dashboard
                        </p>
                        <p className="text-white/80 text-xs">
                          Real-time management & control
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white/90 text-xs">Live</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 -z-10 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-lg blur-lg"></div>
              <div className="absolute -bottom-6 -right-6 -z-10 w-32 h-32 bg-violet-100 dark:bg-violet-900/20 rounded-lg blur-lg"></div>
            </div>
          </motion.div>

          {/* Text Block with parallax */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 order-1 lg:order-2 space-y-8"
          >
            <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-1 border border-blue-200 dark:border-blue-800/50">
              For Parking Administrators
            </div>

            <h2 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              Powerful Admin Controls
            </h2>

            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl">
              Streamline parking operations with sophisticated tools designed for
              efficiency, clarity, and speed. Everything you need to manage your
              parking spaces effectively.
            </p>

            <div className="space-y-6 pt-2">
              {[
                {
                  title: "Book Slot on User Arrival",
                  desc: "Admins can quickly allocate slots to walk-in users with no prior booking.",
                },
                {
                  title: "Real-time Space Management",
                  desc: "Get a live view and control of parking occupancy and availability.",
                },
                {
                  title: "Reporting & Analytics",
                  desc: "Track trends, revenue, and usage with detailed insights.",
                },
              ].map(({ title, desc }, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4 group"
                  key={index}
                >
                  <div className="flex-shrink-0 rounded-full p-1 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                      {title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Button className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 py-6 shadow-lg shadow-blue-500/20 dark:shadow-blue-700/10 hover:shadow-xl hover:shadow-blue-500/30 dark:hover:shadow-blue-700/20 transition-all duration-300">
                <span className="flex items-center gap-2">
                  Learn about admin features{" "}
                  <ArrowRight size={16} />
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
