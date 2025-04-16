import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function AdminPreview() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl border dark:border-neutral-800"
          >
            <img
              src="https://img.freepik.com/free-photo/person-preparing-get-driver-license_23-2150167566.jpg?ga=GA1.1.111555767.1744038035&semt=ais_country_boost&w=740"
              alt="Admin Dashboard"
              className="object-cover w-full h-full"
            />
          </motion.div>

          {/* Text Block */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold leading-tight text-neutral-900 dark:text-white">
              Powerful Admin Controls
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Streamline parking operations with tools designed for efficiency,
              clarity, and speed.
            </p>

            <div className="space-y-6">
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
                <div className="flex items-start space-x-4" key={index}>
                  <div className="text-blue-400 mt-1">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
                      {title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
