import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 text-zinc-800 dark:text-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Transform Your Parking Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-gray-400 mb-8"
          >
            Join thousands of users who have simplified their parking with our platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size={"lg"} variant="default">
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button asChild variant="outline" size={"lg"}>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}