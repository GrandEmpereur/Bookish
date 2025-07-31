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
import type { UsagePurpose } from "@/types/userTypes";
import { toast } from "sonner";
import { RegisterStepOneRequest } from "@/types/authTypes";

const purposes: Array<{
  id: UsagePurpose;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: "find_books",
    label: "Découvrir de nouveaux livres",
    description: "Trouvez des recommandations personnalisées",
    icon: "/img/onbordingRegisterSetp/bear_book.png",
  },
  {
    id: "find_community",
    label: "Rejoindre une communauté",
    description: "Partagez et échangez avec d'autres lecteurs",
    icon: "/img/onbordingRegisterSetp/bear_community.png",
  },
  {
    id: "both",
    label: "Trouver de nouveaux livres et rejoindre une communauté",
    description: "Découvrez et partagez en même temps",
    icon: "/img/onbordingRegisterSetp/bear_book_community.png",
  },
  {
    id: "créer_compte_professionel",
    label: "Créer un compte professionel",
    description: "Je souhaite créer un compte pour professionel",
    icon: "/img/onbordingRegisterSetp/bear_pro.png",
  },
];

export default function Purpose() {
  const [selectedPurpose, setSelectedPurpose] = useState<UsagePurpose | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { completeStepOne } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    if (!storedEmail) {
      router.replace("/auth/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handlePurposeSelection = async (purpose: UsagePurpose) => {
    try {
      setIsLoading(true);
      setSelectedPurpose(purpose);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      const data: RegisterStepOneRequest = {
        email,
        usagePurpose: purpose,
      };

      await completeStepOne(data);

      // Petit délai pour montrer la sélection
      setTimeout(() => {
        router.push("/auth/register/habits");
      }, 800);
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
      setSelectedPurpose(null);
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
        <div className="absolute top-20 right-12 w-36 h-36 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-amber-400/12 to-orange-400/12" />
        <div className="absolute bottom-28 left-8 w-32 h-32 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-teal-400/10 to-cyan-400/10" />
        <div className="absolute top-1/2 left-4 w-28 h-28 rounded-full opacity-4 blur-2xl bg-gradient-to-r from-purple-400/8 to-violet-400/8" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-24 left-12 text-amber-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={18} />
      </motion.div>

      <motion.div
        className="absolute bottom-36 right-10 text-teal-400/25"
        animate={{ y: [-4, 4] }}
        transition={{
          duration: 3.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={16} />
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-purple-400/20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={14} />
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
              href="/auth/register/verification"
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
          Pourquoi rejoignez-vous Bookish ?
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-center mb-8"
          variants={itemVariants}
        >
          Sélectionnez votre objectif principal
        </motion.p>

        {/* Cartes de sélection */}
        <motion.div
          className="space-y-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {purposes.map((purpose, index) => (
            <motion.div
              key={purpose.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.button
                onClick={() => handlePurposeSelection(purpose.id)}
                disabled={isLoading}
                className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all duration-200 relative overflow-hidden
                  ${
                    selectedPurpose === purpose.id
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
                  {selectedPurpose === purpose.id && (
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
                    selectedPurpose === purpose.id ? { scale: [1, 1.1, 1] } : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    src={purpose.icon}
                    alt={purpose.label}
                    width={24}
                    height={24}
                  />
                </motion.div>

                <div className="text-left relative z-10">
                  <motion.h3
                    className="font-medium mb-1"
                    animate={
                      selectedPurpose === purpose.id
                        ? { color: "rgb(var(--primary-700))" }
                        : {}
                    }
                    transition={{ duration: 0.2 }}
                  >
                    {purpose.label}
                  </motion.h3>
                  <p className="text-sm text-muted-foreground">
                    {purpose.description}
                  </p>
                </div>

                <AnimatePresence>
                  {isLoading && selectedPurpose === purpose.id && (
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
                  {selectedPurpose === purpose.id && !isLoading && (
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
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="w-2 h-2 rounded-full bg-muted-300" />
          <div className="w-2 h-2 rounded-full bg-muted-300" />
          <motion.span
            className="text-xs text-muted-foreground ml-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Étape 1 sur 3
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
