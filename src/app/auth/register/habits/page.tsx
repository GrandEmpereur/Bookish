"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Sparkles,
  Heart,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import type { ReadingHabit } from "@/types/userTypes";
import type { RegisterStepTwoRequest } from "@/types/authTypes";
import { toast } from "sonner";

const readingHabits: Array<{
  id: ReadingHabit;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: "library_rat",
    label: "Grand lecteur",
    description: "Je lis plus de 20 livres par an",
    icon: "/img/onbordingRegisterSetp/Book_Lover.png",
  },
  {
    id: "occasional_reader",
    label: "Lecteur régulier",
    description: "Je lis entre 5 et 20 livres par an",
    icon: "/img/onbordingRegisterSetp/Notebook_Design.png",
  },
  {
    id: "beginner_reader",
    label: "Lecteur débutant",
    description: "Je lis moins de 5 livres par an",
    icon: "/img/onbordingRegisterSetp/Bookshelves_design.png",
  },
];

export default function Habits() {
  const [selectedHabit, setSelectedHabit] = useState<ReadingHabit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { completeStepTwo } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    if (!storedEmail) {
      router.replace("/auth/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleHabitSelection = async (habit: ReadingHabit) => {
    try {
      setIsLoading(true);
      setSelectedHabit(habit);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      const data: RegisterStepTwoRequest = {
        email,
        readingHabit: habit,
      };

      await completeStepTwo(data);

      // Petit délai pour montrer la sélection
      setTimeout(() => {
        router.push("/auth/register/genres");
      }, 800);
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
      setSelectedHabit(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      className="min-h-dvh flex flex-col px-5 bg-gradient-to-br from-background via-background to-muted/20 pt-[60px] relative overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-12 w-38 h-38 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-rose-400/12 to-pink-400/12" />
        <div className="absolute bottom-24 right-8 w-34 h-34 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-indigo-400/10 to-blue-400/10" />
        <div className="absolute top-2/3 left-6 w-26 h-26 rounded-full opacity-4 blur-2xl bg-gradient-to-r from-emerald-400/8 to-teal-400/8" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-28 right-16 text-rose-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={17} />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-12 text-indigo-400/25"
        animate={{ y: [-3, 3] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={15} />
      </motion.div>

      <motion.div
        className="absolute top-44 left-8 text-emerald-400/20"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={13} />
      </motion.div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center items-center relative z-10">
        {/* Bouton retour animé */}
        <motion.div variants={itemVariants} className="mb-8 w-full">
          <motion.div
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/auth/register/purpose"
              className="text-black flex items-center gap-2 w-fit"
            >
              <ChevronLeft size={24} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Titre animé */}
        <motion.h1
          className="text-2xl font-heading mb-2 text-center"
          variants={itemVariants}
        >
          Vos habitudes de lecture
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-center mb-8"
          variants={itemVariants}
        >
          Sélectionnez votre profil de lecteur
        </motion.p>

        {/* Cartes de sélection */}
        <motion.div
          className="space-y-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {readingHabits.map((habit, index) => (
            <motion.div
              key={habit.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.button
                onClick={() => handleHabitSelection(habit.id)}
                disabled={isLoading}
                className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all duration-200 relative overflow-hidden
                  ${
                    selectedHabit === habit.id
                      ? "bg-primary-50 border-primary shadow-lg scale-105"
                      : "bg-accent-100 border-transparent hover:border-primary/20 hover:shadow-md"
                  }
                  ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-102"
                  }
                `}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                transition={{ duration: 0.2 }}
              >
                {/* Effet de lueur pour la sélection */}
                <AnimatePresence>
                  {selectedHabit === habit.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 relative z-10"
                  animate={
                    selectedHabit === habit.id ? { scale: [1, 1.1, 1] } : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={habit.icon}
                    alt={habit.label}
                    width={24}
                    height={24}
                  />
                </motion.div>

                <div className="text-left relative z-10">
                  <motion.h3
                    className="font-medium mb-1"
                    animate={
                      selectedHabit === habit.id
                        ? { color: "rgb(var(--primary-700))" }
                        : {}
                    }
                    transition={{ duration: 0.2 }}
                  >
                    {habit.label}
                  </motion.h3>
                  <p className="text-sm text-muted-foreground">
                    {habit.description}
                  </p>
                </div>

                <AnimatePresence>
                  {isLoading && selectedHabit === habit.id && (
                    <motion.div
                      className="ml-auto relative z-10"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ willChange: "transform" }}
                      >
                        <Loader2 className="h-4 w-4 text-primary" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {selectedHabit === habit.id && !isLoading && (
                    <motion.div
                      className="ml-auto relative z-10"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 360],
                        }}
                        transition={{
                          scale: {
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          rotate: { duration: 0.4, ease: "easeOut" },
                        }}
                        style={{ willChange: "transform" }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Indication de progression */}
        <motion.div
          className="flex items-center gap-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-2 h-2 rounded-full bg-muted-300" />
          <motion.span
            className="text-xs text-muted-foreground ml-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Étape 2 sur 3
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
