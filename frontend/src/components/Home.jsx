import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "./shared/Navbar"; // Assuming a public-facing Navbar
import {Card,CardContent} from "@/components/ui/card";

// Placeholder icons for features (you can replace with actual SVGs or an icon library)
const Icon = ({ children }) => (
  <div className="text-4xl text-rose-500 mb-4">{children}</div>
);

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 text-rose-800">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="text-center md:text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-5xl md:text-6xl font-serif font-bold text-rose-800 mb-6 drop-shadow-sm"
              variants={itemVariants}
            >
              Your Family's Story, All in One Place.
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-rose-700 max-w-lg mx-auto md:mx-0 mb-8"
              variants={itemVariants}
            >
              Virasat is a private, collaborative space to preserve your
              family's precious memories, stories, and history for generations
              to come.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                size="lg"
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 py-6 text-lg shadow-lg"
              >
                Create Your Family Trunk
              </Button>
            </motion.div>
          </motion.div>
          {/* Nostalgic Card - Added hover effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full"
          >
            <Card className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-rose-50/80 border-rose-200">
              <CardContent className="p-6 flex flex-col gap-4 items-center">
                <img
                  src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800"
                  alt="A beautiful landscape representing a cherished memory"
                  className="rounded-xl shadow-md w-full object-cover max-h-64"
                />
                <p className="text-center text-rose-900 text-lg font-medium font-serif">
                  "The best moments are the ones we share with those we love."
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-rose-100/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-4">How It Works</h2>
          <p className="text-lg text-rose-700 mb-12 max-w-2xl mx-auto">
            Getting started is simple. In just a few steps, you can create a
            beautiful, living archive of your family's history.
          </p>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* Step 1 */}
            <motion.div
              className="p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg"
              variants={itemVariants}
            >
              <div className="text-5xl font-serif font-bold text-rose-300 mb-4">
                1
              </div>
              <h3 className="text-2xl font-semibold font-serif mb-2">
                Create Your Trunk
              </h3>
              <p className="text-rose-700">
                Establish a private, secure space for your family with a single
                click.
              </p>
            </motion.div>
            {/* Step 2 */}
            <motion.div
              className="p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg"
              variants={itemVariants}
            >
              <div className="text-5xl font-serif font-bold text-rose-300 mb-4">
                2
              </div>
              <h3 className="text-2xl font-semibold font-serif mb-2">
                Invite Your Family
              </h3>
              <p className="text-rose-700">
                Send simple email invitations to bring everyone together in one
                place.
              </p>
            </motion.div>
            {/* Step 3 */}
            <motion.div
              className="p-8 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg"
              variants={itemVariants}
            >
              <div className="text-5xl font-serif font-bold text-rose-300 mb-4">
                3
              </div>
              <h3 className="text-2xl font-semibold font-serif mb-2">
                Preserve Memories
              </h3>
              <p className="text-rose-700">
                Collaborate to add photos, share stories, and build your
                collective history.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-12">
            A Living History Book
          </h2>
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* Feature 1 */}
            <motion.div className="text-center p-6" variants={itemVariants}>
              <Icon>⏳</Icon>
              <h3 className="text-2xl font-semibold font-serif mb-2">
                The Timeline
              </h3>
              <p className="text-rose-700">
                Journey through a visual, chronological narrative of your
                family's history, from past generations to today.
              </p>
            </motion.div>
            {/* Feature 2 */}
            <motion.div className="text-center p-6" variants={itemVariants}>
              <Icon>💡</Icon>
              <h3 className="text-2xl font-semibold font-serif mb-2">
                Story Prompts
              </h3>
              <p className="text-rose-700">
                Engaging weekly prompts help family members recall and share
                forgotten stories and precious moments.
              </p>
            </motion.div>
            {/* Feature 3 */}
            <motion.div className="text-center p-6" variants={itemVariants}>
              <Icon>📖</Icon>
              <h3 className="text-2xl font-semibold font-serif mb-2">
                Book Creation
              </h3>
              <p className="text-rose-700">
                With one click, transform your family's collection of memories
                into a beautifully formatted, printable book.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-rose-600 font-light">
        © 2025 Virasat. All rights reserved.
      </footer>
    </div>
  );
}
