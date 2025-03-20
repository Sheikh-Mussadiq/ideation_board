import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SocialHubSmiley from "../assets/SocialHub.png";

const loadingPhrases = [
  "Organizing your ideas...",
  "Bringing collaboration to life...",
  "Turning thoughts into action...",
  "Streamlining your workflow...",
  "Managing tasks efficiently...",
  "Your productivity, our priority...",
];

export default function LoadingScreen() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) =>
        prevIndex === loadingPhrases.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-design-lightPurpleButtonFill to-white dark:from-design-black dark:to-design-black/70 z-50">
      <div className="relative w-full h-full">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-design-primaryPurple rounded-full"
                style={{
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.1,
                  filter: "blur(50px)",
                  transform: "translate(-50%, -50%)",
                  animation: `float ${
                    Math.random() * 10 + 10
                  }s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="bg-white dark:bg-design-black/80 rounded-2xl shadow-2xl p-10 max-w-md w-full backdrop-blur-lg border border-design-greyOutlines dark:border-design-greyOutlines/20">
            {/* SocialHub Logo */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl font-bold text-design-primaryPurple text-center flex items-center"
                >
                  Social
                  <span className="text-design-black dark:text-white">Hub</span>
                  <img
                    src={SocialHubSmiley}
                    alt=""
                    className="h-12 w-12 mx-auto ml-2"
                  />
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-0.5 bg-design-primaryPurple mt-1"
                />
              </div>
            </div>

            {/* Ideation Board Title */}
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-design-black dark:text-white text-center mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Ideation Board
            </motion.h1>

            {/* Rolling Text Animation */}
            <div className="h-8 relative overflow-hidden">
              {loadingPhrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 flex justify-center items-center text-lg text-design-primaryGrey dark:text-design-greyOutlines text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentPhraseIndex === index ? 1 : 0,
                    y: currentPhraseIndex === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {phrase}
                </motion.div>
              ))}
            </div>

            {/* Loading Progress */}
            <div className="mt-12">
              <div className="relative h-1 w-full bg-design-greyBG dark:bg-design-black rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-design-primaryPurple"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center mt-8 gap-2">
              {[0, 1, 2].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2 h-2 rounded-full bg-design-primaryPurple"
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: dot * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
