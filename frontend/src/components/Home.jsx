import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from "react";
import Navbar from "./shared/Navbar";

const Home = () => {
  return (
    <>  
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col items-center w-full max-w-xl">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-serif font-bold text-rose-800 mb-6 drop-shadow-sm text-center"
        >
          Welcome Home
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-rose-700 text-center mb-10"
        >
          A place where warmth lives, memories linger, and love feels endless.
        </motion.p>

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
              {/* Button - Added hover transition */}
              <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-2 shadow-md transition-colors duration-300">
                Visit Memories
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-0 text-sm text-rose-600 font-light"
      >
        © 2025 Virasat. All rights reserved.
      </motion.footer>
    </div>
    </>
  );
};

export default Home;
