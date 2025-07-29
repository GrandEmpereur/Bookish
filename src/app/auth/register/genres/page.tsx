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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RegisterStepThreeRequest } from "@/types/authTypes";
import { toast } from "sonner";

const genres: Array<{
  id: string;
  label: string;
}> = [
  { id: "fantasy", label: "Fantasy" },
  { id: "sci-fi", label: "Science Fiction" },
  { id: "romance", label: "Romance" },
  { id: "thriller", label: "Thriller" },
  { id: "mystery", label: "Mystère" },
  { id: "horror", label: "Horreur" },
  { id: "historical", label: "Historique" },
  { id: "contemporary", label: "Contemporain" },
  { id: "literary", label: "Littérature" },
  { id: "non-fiction", label: "Non-Fiction" },
  { id: "biography", label: "Biographie" },
  { id: "self-help", label: "Développement Personnel" },
];

export default function Genres() {
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { completeStepThree } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    if (!storedEmail) {
      router.replace("/auth/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const toggleGenre = (genreId: string) => {
    if (isLoading || isSuccess) return;

    // Retour haptique léger sur mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setPreferredGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = async () => {
    if (preferredGenres.length === 0) {
      toast.error("Veuillez sélectionner au moins un genre");
      return;
    }

    try {
      setIsLoading(true);
      const data: RegisterStepThreeRequest = {
        email,
        preferredGenres: preferredGenres,
      };

      await completeStepThree(data);
      setIsSuccess(true);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      // Attendre un peu pour montrer le succès puis rediriger
      setTimeout(() => {
        // ✅ Indique au feed qu’il doit afficher le popup une seule fois

        localStorage.setItem("needUnboarding", "1");

        // Nettoyage et redirection vers le feed
        sessionStorage.removeItem("verificationEmail");
        router.replace("/feed");
      }, 2500);
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
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
        staggerChildren: 0.08,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeOut",
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
        ease: "easeOut",
      },
    },
  };

  const badgeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
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
        <div className="absolute top-20 right-10 w-42 h-42 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-cyan-400/12 to-blue-400/12" />
        <div className="absolute bottom-20 left-8 w-36 h-36 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-orange-400/10 to-red-400/10" />
        <div className="absolute top-1/2 right-4 w-28 h-28 rounded-full opacity-4 blur-2xl bg-gradient-to-r from-green-400/8 to-emerald-400/8" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-32 left-10 text-cyan-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={19} />
      </motion.div>

      <motion.div
        className="absolute bottom-28 right-12 text-orange-400/25"
        animate={{ y: [-4, 4] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={17} />
      </motion.div>

      <motion.div
        className="absolute top-48 right-20 text-green-400/20"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{
          duration: 5.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={15} />
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
              href="/auth/register/habits"
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
          Vos genres préférés
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-center mb-8"
          variants={itemVariants}
        >
          Sélectionnez les genres qui vous intéressent
        </motion.p>

        {/* Grille de badges */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              variants={badgeVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <motion.div
                whileTap={!isLoading && !isSuccess ? { scale: 0.95 } : {}}
                transition={{ duration: 0.15 }}
              >
                <button
                  onClick={() => toggleGenre(genre.id)}
                  disabled={isLoading || isSuccess}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    preferredGenres.includes(genre.id)
                      ? "bg-primary-100 text-primary-800 border-primary-300 shadow-md"
                      : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                  } ${
                    isLoading || isSuccess
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-sm"
                  }`}
                >
                  {genre.label}
                </button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Compteur de sélection */}
        <AnimatePresence>
          {preferredGenres.length > 0 && (
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-sm text-primary-600 font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {preferredGenres.length} genre
                {preferredGenres.length > 1 ? "s" : ""} sélectionné
                {preferredGenres.length > 1 ? "s" : ""}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouton de finalisation */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Button
            className="w-full h-14 transition-colors duration-200"
            onClick={handleSubmit}
            disabled={preferredGenres.length === 0 || isLoading || isSuccess}
            asChild
          >
            <motion.button
              whileHover={
                preferredGenres.length > 0 &&
                !isLoading &&
                !isSuccess &&
                window.innerWidth >= 768
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                preferredGenres.length > 0 && !isLoading && !isSuccess
                  ? { scale: 0.98 }
                  : {}
              }
              transition={{ duration: 0.15 }}
              className={`${
                isSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-primary-800 hover:bg-primary-900"
              } text-white`}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center"
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
                      <Loader2 className="mr-2 h-4 w-4" />
                    </motion.div>
                    Finalisation...
                  </motion.div>
                ) : isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center"
                  >
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: { duration: 0.5, ease: "easeOut" },
                        scale: {
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                      style={{ willChange: "transform" }}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                    </motion.div>
                    Inscription terminée !
                  </motion.div>
                ) : (
                  <motion.span
                    key="finish"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Terminer l'inscription
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Button>
        </motion.div>

        {/* Indication de progression */}
        <motion.div
          className="flex items-center gap-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <div className="w-2 h-2 rounded-full bg-primary/60" />
          <motion.div
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="text-xs text-muted-foreground ml-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Étape 3 sur 3
          </motion.span>
        </motion.div>

        {/* Animation de succès globale */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-center max-w-sm"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-heading text-green-600 mb-3"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Félicitations ! 🎉
                </motion.h2>
                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Votre compte Bookish a été créé avec succès.
                </motion.p>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Bienvenue dans la communauté des lecteurs !
                </motion.p>
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <motion.p
                    className="text-xs text-muted-foreground"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Redirection vers le feed...
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
