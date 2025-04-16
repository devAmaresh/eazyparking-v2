import { motion } from "framer-motion";
import Button from "@mui/material/Button";

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
    <section className="py-24 bg-white dark:bg-black dark:text-white">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Started Today
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Just three simple steps to transform your parking experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                boxShadow:
                  "0 4px 4px rgba(59, 130, 246, 0.1), 0 4px 4px rgba(59, 130, 246, 0.1)",
              }}
              className="bg-white border dark:bg-zinc-800 shadow-lg rounded-sm p-8 text-center transition-all hover:shadow-xl"
            >
              <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <span className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {step.description}
              </p>
              <Button
                variant="contained"
                className="!bg-black !text-white !w-full !py-2 !rounded-full transition-all"
              >
                {step.button}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
