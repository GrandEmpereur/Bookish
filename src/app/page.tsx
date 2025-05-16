"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { userService } from "@/services/user.service";
import { motion } from "motion/react";

const App: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

    const initializeApp = async () => {
      if (hasSeenOnboarding) {
        router.replace('/auth/login');
      } else {
        router.replace('/onboarding');
      }
    };

    // Attendre que l'animation soit terminée avant de vérifier l'authsss
    setTimeout(initializeApp, 3500);
  }, [router]);

  // Variants pour les animations de type livre
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };

  const pageVariants = {
    hidden: { 
      opacity: 0,
      rotateY: 90,
      transformOrigin: "left center"
    },
    visible: { 
      opacity: 1,
      rotateY: 0,
      transition: { 
        type: "spring", 
        stiffness: 50,
        damping: 15,
        duration: 1.2
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0, y: -20 },
    visible: { 
      scale: 1,
      opacity: 1,
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 80, 
        delay: 0.5,
        duration: 1
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 1.2,
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 10
      }
    }
  };

  // Splitting text for individual letter animation
  const bookishText = "Bookish".split("");

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-primary safe-area-p overflow-hidden">
      <motion.div 
        className="flex flex-col items-center gap-y-8 px-4 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Book page effect container */}
        <motion.div
          className="relative bg-primary-700/20 backdrop-blur-sm rounded-lg w-52 h-52 flex items-center justify-center shadow-lg"
          variants={pageVariants}
        >
          <motion.div 
            className="absolute inset-0 bg-primary-500/10 rounded-lg z-10 border border-primary-400/20"
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ 
              opacity: 1, 
              rotateY: 0,
              transition: { delay: 1, duration: 0.5 }
            }}
          />
          <motion.div className="relative z-20" variants={logoVariants}>
            <Image 
              src="/Bookish.svg" 
              width={80}
              height={68} 
              alt="Logo" 
              priority
              className="w-20 md:w-24 drop-shadow-md"
            />
          </motion.div>
        </motion.div>

        {/* Animated text with individual letters */}
        <motion.div 
          className="overflow-hidden relative"
          variants={textVariants}
        >
          <div className="flex justify-center">
            {bookishText.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="text-3xl md:text-4xl font-heading uppercase text-white font-bold relative inline-block"
                style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-300/60 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
          />
        </motion.div>

        {/* Decoration elements */}
        <motion.div
          className="absolute -z-10 w-64 h-64 bg-primary-500/10 rounded-full blur-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0.6 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        />
        
        <motion.div 
          className="absolute top-0 -right-24 w-32 h-32 bg-accent-300/20 rounded-full blur-xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ delay: 1.2, duration: 1 }}
        />
        
        <motion.div 
          className="absolute bottom-0 -left-24 w-32 h-32 bg-secondary-300/20 rounded-full blur-xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 0.6 }}
          transition={{ delay: 1.5, duration: 1 }}
        />
      </motion.div>
    </div>
  );
};

export default App;
