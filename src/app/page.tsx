"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  BookOpen,
  Heart,
  Star,
  Users,
  MessageCircle,
  Book,
  Share2,
} from "lucide-react";
import { userService } from "@/services/user.service";

const App: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Cercles de blur pour la profondeur
  const blurCircles = [
    { size: 250, color: "rgba(255,215,0,0.08)", x: -80, y: -80, delay: 0 },
    { size: 180, color: "rgba(255,165,0,0.06)", x: 150, y: 120, delay: 3 },
    { size: 220, color: "rgba(255,255,255,0.04)", x: -120, y: 150, delay: 6 },
    { size: 160, color: "rgba(255,192,203,0.05)", x: 80, y: -150, delay: 2 },
  ];

  // Fonction pour animer la sortie avant redirection
  const animateAndRedirect = (destination: string) => {
    setIsExiting(true);
    setTimeout(() => {
      router.replace(destination);
    }, 800); // Délai pour l'animation de sortie
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const response = await userService.getAuthenticatedProfile();
        if (response.data) {
          setTimeout(() => {
            animateAndRedirect("/feed");
          }, 800);
          return;
        }
      } catch (error: any) {
        // Utiliser le service de storage unifié
        let hasSeenOnboarding = false;
        try {
          const { onboardingStorage } = await import("@/lib/storage");
          hasSeenOnboarding = await onboardingStorage.hasSeenOnboarding();
        } catch (storageError) {
          console.warn("Erreur storage, fallback localStorage:", storageError);
          // Fallback sur localStorage
          const stored = localStorage.getItem("hasSeenOnboarding");
          hasSeenOnboarding = stored === "true";
        }

        setTimeout(() => {
          if (!hasSeenOnboarding) {
            animateAndRedirect("/onboarding");
          } else {
            animateAndRedirect("/auth/login");
          }
        }, 2100);
        return;
      }
    };

    setTimeout(() => {
      setLoading(false);
      initializeApp();
    }, 1500);
  }, [router]);

  return (
    <div className="relative flex items-center justify-center w-full h-dvh bg-gradient-to-br from-primary via-primary-600 to-primary-800 overflow-hidden">
      {/* Lueurs colorées principales - Encadrant parfaitement le logo */}
      <div
        className="absolute top-1/2 left-1/2 w-44 h-44 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-pink-400/30 rounded-full blur-xl pointer-events-none"
        style={{ transform: "translate(-50%, -50%) translate(-8rem, -4rem)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-40 h-40 bg-gradient-to-r from-purple-400/30 via-violet-400/30 to-blue-400/30 rounded-full blur-xl pointer-events-none"
        style={{ transform: "translate(-50%, -50%) translate(8rem, 4rem)" }}
      />

      {/* Lueurs d'ambiance dispersées en arrière-plan - Palette étendue */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-cyan-400/15 via-blue-300/15 to-indigo-300/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-r from-emerald-400/15 via-green-300/15 to-teal-300/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-20 left-1/2 w-20 h-20 bg-gradient-to-r from-violet-400/12 via-purple-300/12 to-fuchsia-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-32 left-16 w-32 h-32 bg-gradient-to-r from-rose-400/15 via-pink-300/15 to-red-300/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/2 right-12 w-24 h-24 bg-gradient-to-r from-amber-400/12 via-yellow-300/12 to-orange-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 w-20 h-20 bg-gradient-to-r from-sky-400/12 via-cyan-300/12 to-blue-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-16 right-16 w-16 h-16 bg-gradient-to-r from-lime-400/10 via-green-300/10 to-emerald-300/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/4 left-20 w-24 h-24 bg-gradient-to-r from-indigo-400/12 via-blue-300/12 to-cyan-300/12 rounded-full blur-2xl pointer-events-none" />

      {/* Nouvelles lueurs avec couleurs additionnelles */}
      <div className="absolute bottom-1/4 right-20 w-28 h-28 bg-gradient-to-r from-orange-400/12 via-red-300/12 to-pink-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 left-12 w-24 h-24 bg-gradient-to-r from-teal-400/12 via-cyan-300/12 to-blue-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-20 h-20 bg-gradient-to-r from-purple-400/10 via-violet-300/10 to-indigo-300/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-28 h-28 bg-gradient-to-r from-yellow-400/12 via-orange-300/12 to-red-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-12 right-1/3 w-20 h-20 bg-gradient-to-r from-pink-400/11 via-rose-300/11 to-red-300/11 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/5 w-24 h-24 bg-gradient-to-r from-green-400/12 via-emerald-300/12 to-teal-300/12 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-3/4 right-1/5 w-20 h-20 bg-gradient-to-r from-violet-400/11 via-purple-300/11 to-indigo-300/11 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-2/3 right-1/2 w-16 h-16 bg-gradient-to-r from-amber-400/10 via-yellow-300/10 to-orange-300/10 rounded-full blur-2xl pointer-events-none" />

      {/* Arrière-plan avec cercles de blur */}
      <motion.div
        className="absolute inset-0"
        animate={
          isExiting ? { opacity: 0, scale: 1.2 } : { opacity: 1, scale: 1 }
        }
        transition={{
          duration: isExiting ? 0.8 : 0,
          ease: "easeInOut",
        }}
      >
        {blurCircles.map((circle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: circle.size,
              height: circle.size,
              background: `radial-gradient(circle, ${circle.color} 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
            initial={{
              x: circle.x - circle.size / 2,
              y: circle.y - circle.size / 2,
              scale: 0.5,
              opacity: 0,
            }}
            animate={
              isExiting
                ? {
                    x: circle.x - circle.size / 2,
                    y: circle.y - circle.size / 2,
                    scale: 2,
                    opacity: 0,
                  }
                : {
                    x: [
                      circle.x - circle.size / 2,
                      circle.x - circle.size / 2 + 30,
                      circle.x - circle.size / 2 - 20,
                      circle.x - circle.size / 2,
                    ],
                    y: [
                      circle.y - circle.size / 2,
                      circle.y - circle.size / 2 - 40,
                      circle.y - circle.size / 2 + 20,
                      circle.y - circle.size / 2,
                    ],
                    scale: [0.5, 1, 0.8, 1],
                    opacity: [0, 0.6, 0.3, 0.6],
                  }
            }
            transition={{
              duration: isExiting ? 0.8 : 12,
              delay: isExiting ? 0 : circle.delay,
              repeat: isExiting ? 0 : Infinity,
              repeatType: isExiting ? "loop" : "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Contenu principal */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center px-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isExiting
            ? { opacity: 0, scale: 1.1, y: -50 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={{
          duration: isExiting ? 0.8 : 1,
          ease: isExiting ? [0.32, 0, 0.67, 0] : [0.23, 1, 0.32, 1],
        }}
      >
        {/* Logo principal */}
        <motion.div
          className="relative mb-8"
          initial={{
            y: 50,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            delay: 0.5,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <div className="relative bg-white/15 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
            <Image
              src="/Bookish.svg"
              width={80}
              height={68}
              alt="Logo"
              priority
              className="w-20 md:w-24"
            />

            {/* Icônes sociales simples */}
            <motion.div
              className="absolute -top-2 -right-2 text-yellow-300"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Star size={16} />
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-2 text-pink-300"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={16} />
            </motion.div>

            <motion.div
              className="absolute top-1/2 -left-4 text-blue-300"
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Share2 size={14} />
            </motion.div>
          </div>
        </motion.div>

        {/* Texte principal */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.23, 1, 0.32, 1],
          }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-heading text-white font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {"Bookish".split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 1.5 + index * 0.08,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="text-white/80 text-lg md:text-xl font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 2,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            La communauté des passionnés de lecture
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-6 text-white/70 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 2.3,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Découvrir</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Partager</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>Échanger</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Indicateur de chargement - Position absolue pour ne pas affecter le layout */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div key={index} className="relative">
                <motion.div
                  className="w-3 h-3 bg-white/60 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay pour la lisibilité */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10"
        animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
        transition={{
          duration: isExiting ? 0.8 : 0,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default App;
