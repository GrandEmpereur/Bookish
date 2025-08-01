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
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/contexts/auth-context";
import type { VerifyResetCodeRequest } from "@/types/authTypes";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyResetCode() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { verifyResetCode } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetPasswordEmail");
    if (!storedEmail) {
      router.replace("/auth/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleVerification = async () => {
    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }

    try {
      setIsLoading(true);
      const data: VerifyResetCodeRequest = {
        email,
        code,
      };

      await verifyResetCode(data);
      setIsSuccess(true);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      // Attendre un peu pour montrer le succès puis rediriger
      setTimeout(() => {
        router.push("/auth/forgot-password/reset");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Le code de vérification est invalide");
      setCode("");
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

  const otpVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
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
        <div className="absolute top-20 left-10 w-28 sm:w-32 h-28 sm:h-32 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-green-400/15 to-blue-400/15" />
        <div className="absolute bottom-40 right-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-purple-400/10 to-pink-400/10" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-40 right-12 text-green-400/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
      </motion.div>

      <motion.div
        className="absolute bottom-60 left-8 text-blue-400/20"
        animate={{ y: [-5, 5] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={14} className="sm:w-4 sm:h-4" />
      </motion.div>

      <div className="flex-1 flex flex-col max-w-sm sm:max-w-md mx-auto w-full justify-center relative z-10">
        {/* Bouton retour animé */}
        <motion.div variants={itemVariants} className="mb-6 pt-[60px]">
          <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
            <Link
              href="/auth/forgot-password"
              className="text-black flex items-center gap-2 w-fit"
            >
              <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Titre animé */}
        <motion.h1
          className="text-xl sm:text-2xl font-heading mb-2 text-center"
          variants={itemVariants}
        >
          Vérification du code
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-center mb-8 text-sm sm:text-base"
          variants={itemVariants}
        >
          Entrez le code à 6 chiffres envoyé à
          <br />
          <motion.span
            className="font-medium text-primary-700"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {email}
          </motion.span>
        </motion.p>

        {/* Champ OTP animé */}
        <motion.div className="flex justify-center mb-8" variants={otpVariants}>
          <motion.div
            animate={isSuccess ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              disabled={isLoading || isSuccess}
            >
              <InputOTPGroup>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <InputOTPSlot index={0} />
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <InputOTPSlot index={1} />
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <InputOTPSlot index={2} />
                </motion.div>
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <InputOTPSlot index={3} />
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <InputOTPSlot index={4} />
                </motion.div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <InputOTPSlot index={5} />
                </motion.div>
              </InputOTPGroup>
            </InputOTP>
          </motion.div>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          {/* Bouton de vérification */}
          <Button
            className="w-full h-12 sm:h-14 transition-colors duration-200"
            onClick={handleVerification}
            disabled={code.length !== 6 || isLoading || isSuccess}
            asChild
          >
            <motion.button
              whileTap={
                code.length === 6 && !isLoading && !isSuccess
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
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
                    Code vérifié !
                  </motion.div>
                ) : (
                  <motion.span
                    key="verify"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Vérifier
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </Button>

          {/* Bouton d'annulation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Button
              variant="ghost"
              className="w-full h-10 sm:h-12 text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm sm:text-base"
              onClick={() => {
                sessionStorage.removeItem("resetPasswordEmail");
                router.push("/auth/login");
              }}
              disabled={isLoading || isSuccess}
              asChild
            >
              <motion.button
                whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ willChange: "transform" }}
                >
                  <X className="mr-2 h-4 w-4" />
                </motion.div>
                Annuler et retourner à la connexion
              </motion.button>
            </Button>
          </motion.div>
        </motion.div>

        {/* Indication visuelle pour code complet */}
        <AnimatePresence>
          {code.length === 6 && !isLoading && !isSuccess && (
            <motion.div
              className="text-center mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                className="text-xs sm:text-sm text-green-600 font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✓ Code complet - Prêt à vérifier
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animation de succès globale */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-center max-w-xs sm:max-w-sm px-4"
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
                  <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <motion.h2
                  className="text-lg sm:text-xl font-heading text-green-600 mb-2"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Code vérifié avec succès !
                </motion.h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Redirection en cours...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
