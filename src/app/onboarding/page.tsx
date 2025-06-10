"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  BookOpen,
  Users,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Heart,
} from "lucide-react";

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const onboardingSteps = [
    {
      title: {
        start: "Découvrez de nouveaux ",
        highlight: "mondes",
      },
      description:
        "Plongez dans l'univers fascinant des livres et découvrez des histoires captivantes. Rejoignez notre communauté.",
      image: "/img/onboarding/presentation1.png",
      icon: BookOpen,
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      title: {
        start: "Partagez vos lectures ",
        highlight: "préférées",
      },
      description:
        "Partagez vos avis, vos recommandations et découvrez de nouveaux livres grâce aux suggestions de notre communauté",
      image: "/img/onboarding/presentation2.png",
      icon: Users,
      color: "from-green-500/20 to-blue-500/20",
    },
    {
      title: {
        start: "Discutez avec d'autres ",
        highlight: "passionnés",
      },
      description:
        "Engagez-vous dans des discussions passionnantes avec d'autres amateurs de littérature. Partagez vos réflexions.",
      image: "/img/onboarding/presentation3.png",
      icon: MessageCircle,
      color: "from-orange-500/20 to-pink-500/20",
    },
  ];

  const currentStepData = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  // Animation similaire au loading screen pour la sortie
  const animateAndRedirect = async () => {
    setIsExiting(true);
    try {
      // Utiliser le service de storage unifié
      const { onboardingStorage, storageDebug } = await import("@/lib/storage");
      await onboardingStorage.setOnboardingSeen(true);

      // 🔍 DEBUG - Log pour voir dans Xcode Console
      await storageDebug.logAllPreferences();
    } catch (error) {
      console.warn("Erreur lors de la sauvegarde onboarding:", error);
      // Fallback sur localStorage
      localStorage.setItem("hasSeenOnboarding", "true");
    }
    setTimeout(() => {
      router.replace("/auth/login");
    }, 800);
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      animateAndRedirect();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Animations variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      scale: 1.1,
      y: -50,
      transition: { duration: 0.8, ease: [0.32, 0, 0.67, 0] },
    },
  };

  const imageVariants = {
    initial: { scale: 0.8, opacity: 0, y: 50 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
    },
    exit: {
      scale: 1.1,
      opacity: 0,
      y: -30,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, delay: 0.6, ease: [0.23, 1, 0.32, 1] },
    },
    whileHover: {
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 },
    },
    whileTap: { scale: 0.98 },
  };

  return (
    <motion.div
      className="min-h-[100dvh] bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden relative"
      variants={containerVariants}
      initial="initial"
      animate={isExiting ? "exit" : "animate"}
    >
      {/* Arrière-plan avec cercles de blur */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        animate={
          isExiting ? { opacity: 0, scale: 1.2 } : { opacity: 1, scale: 1 }
        }
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: `linear-gradient(135deg, ${currentStepData.color})`,
          }}
          animate={{
            x: [-100, 100, -50],
            y: [-50, 50, -100],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-0 top-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl bg-gradient-to-r from-primary/30 to-primary-600/30"
          animate={{
            x: [50, -50, 100],
            y: [100, -100, 50],
            scale: [1.2, 1, 1.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>

      {/* Éléments graphiques décoratifs */}
      <motion.div
        className="absolute top-20 left-8 text-yellow-400/40"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles size={24} />
      </motion.div>

      <motion.div
        className="absolute top-32 right-12 text-pink-400/30"
        animate={{
          y: [-10, 10, -10],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Heart size={20} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-20 text-purple-400/25"
        animate={{
          rotate: [0, -360],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <BookOpen size={22} />
      </motion.div>

      {/* Bouton Passer en position absolue */}
      {!isLastStep && (
        <motion.button
          onClick={animateAndRedirect}
          className="absolute top-[65px] right-8 z-30 text-sm font-medium text-muted-foreground active:text-foreground transition-colors bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Passer
        </motion.button>
      )}

      {/* Layout Mobile */}
      <div className="flex flex-col min-h-[100dvh] md:hidden">
        {/* Image Mobile */}
        <div className="relative h-[45vh] w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="absolute inset-0"
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="relative w-full h-full">
                <Image
                  src={currentStepData.image}
                  alt="Onboarding"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  quality={90}
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contenu Mobile */}
        <div className="flex-1 flex flex-col px-6 pt-8 pb-8 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentStep}`}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="text-center flex-1"
            >
              <motion.h2 className="text-3xl font-heading mb-6 leading-tight">
                {currentStepData.title.start}
                <span className="relative inline-block">
                  <span className="text-primary-600 font-bold">
                    {currentStepData.title.highlight}
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
              </motion.h2>

              <motion.p
                className="text-muted-foreground text-base leading-relaxed max-w-sm mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {currentStepData.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Mobile */}
          <div className="mt-auto space-y-8 pb-8">
            {/* Indicateurs de progression */}
            <motion.div
              className="flex justify-center gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {onboardingSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentStep
                      ? "w-8 bg-primary-600"
                      : index < currentStep
                        ? "w-2 bg-primary-400"
                        : "w-2 bg-muted"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.8 + index * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                />
              ))}
            </motion.div>

            {/* Boutons de navigation Mobile */}
            <motion.div
              className="flex gap-4"
              variants={buttonVariants}
              initial="initial"
              animate="animate"
            >
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 h-12 border border-muted-foreground/20 rounded-xl font-medium text-muted-foreground active:text-foreground active:border-foreground/30 transition-colors"
                >
                  Précédent
                </button>
              )}

              <motion.div className={currentStep > 0 ? "flex-1" : "w-full"}>
                <motion.button
                  onClick={handleNext}
                  className="w-full h-12 text-base font-medium bg-primary-600 active:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2"
                  variants={buttonVariants}
                >
                  <span>{isLastStep ? "Commencer" : "Suivant"}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Layout Desktop */}
      <div className="hidden md:flex min-h-[100vh] items-center justify-center p-8">
        <div className="max-w-7xl w-full grid grid-cols-2 gap-16 items-center">
          {/* Côté gauche - Contenu Desktop */}
          <motion.div
            className="relative z-10 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Contenu Desktop */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`desktop-content-${currentStep}`}
                variants={contentVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <motion.h1 className="text-5xl xl:text-6xl font-heading leading-tight">
                  {currentStepData.title.start}
                  <motion.span className="relative inline-block">
                    <span className="text-primary-600 font-bold">
                      {currentStepData.title.highlight}
                    </span>
                    <motion.div
                      className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-muted-foreground text-xl leading-relaxed max-w-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {currentStepData.description}
                </motion.p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Desktop */}
            <div className="space-y-8">
              {/* Indicateurs de progression Desktop */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {onboardingSteps.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`h-3 rounded-full transition-all duration-500 ${
                      index === currentStep
                        ? "w-12 bg-primary-600"
                        : index < currentStep
                          ? "w-3 bg-primary-400"
                          : "w-3 bg-muted"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.8 + index * 0.1,
                      type: "spring",
                      stiffness: 300,
                    }}
                  />
                ))}
              </motion.div>

              {/* Boutons de navigation Desktop */}
              <motion.div
                className="flex gap-6"
                variants={buttonVariants}
                initial="initial"
                animate="animate"
              >
                {currentStep > 0 && (
                  <motion.button
                    onClick={handlePrevious}
                    className="px-8 py-4 border border-muted-foreground/20 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "hsl(var(--muted))",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Précédent
                  </motion.button>
                )}

                <motion.button
                  onClick={handleNext}
                  className="px-12 py-4 text-lg font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-lg shadow-primary-600/25 flex items-center gap-3"
                  variants={buttonVariants}
                  whileHover="whileHover"
                  whileTap="whileTap"
                >
                  <span>{isLastStep ? "Commencer" : "Suivant"}</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Côté droit - Image Desktop */}
          <div className="relative h-[70vh] w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="absolute inset-0"
                variants={imageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={currentStepData.image}
                    alt="Onboarding"
                    fill
                    className="object-cover rounded-3xl"
                    sizes="50vw"
                    quality={90}
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
