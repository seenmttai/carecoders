import React from "react";
import { motion } from "framer-motion";
import heroimg from "../assets/heroimg.png";
import Button from "./Button"; // Import the Button component

export default function HeroSection() {
  return (
    <div className="flex flex-col-reverse lg:flex-row h-auto justify-between items-center p-8 gap-12 mx-10 overflow-hidden">
      <motion.div
        className="w-full lg:w-1/2 text-center lg:text-left"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-3xl lg:text-5xl font-bold">
          Welcome to <span className="text-[#23c483]"> Diagno Plus+ </span>
        </h1>
        <p className="mt-4 text-gray-600">
          At Diagno Plus+, we're revolutionizing healthcare with AI-driven diagnostics. Our advanced technology analyzes images to detect conditions like skin cancer, brain cancer, and more—providing accurate and timely insights for your health.
        </p>
        <Button href="/skin" label="Get Started" />
      </motion.div>
      <motion.div
        className="w-full lg:w-1/2 mb-8 lg:mb-0"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <img src={heroimg} alt="Diagno Plus+ Technology" className="w-full h-[30em] max-w-xl" />
      </motion.div>
    </div>
  );
}
