"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type {
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "@/types/authTypes";
import { toast } from "sonner";

export default function Verification() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const { verifyEmail, resendVerification } = useAuth();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("verificationEmail");
    if (!storedEmail) {
      router.replace("/auth/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Détection du device côté client uniquement
  useEffect(() => {
    const checkDevice = () => setIsDesktop(window.innerWidth >= 768);
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const handleVerification = async () => {
    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }

    try {
      setIsVerifying(true);
      const data: VerifyEmailRequest = { email, code };
      await verifyEmail(data);
      setIsSuccess(true);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      // Attendre un peu pour montrer le succès puis rediriger
      setTimeout(() => {
        router.replace("/auth/register/purpose");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Code invalide, veuillez réessayer");
      setCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (timeLeft > 0) return;

    try {
      setIsLoading(true);
      const data: ResendVerificationRequest = { email };
      await resendVerification(data);
      setTimeLeft(30);

      toast.success("Un nouveau code a été envoyé à votre email");
    } catch (error: any) {
      toast.error("Impossible de renvoyer le code");
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
      className="min-h-dvh flex flex-col px-5 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-24 left-8 w-32 h-32 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-emerald-400/12 to-teal-400/12" />
        <div className="absolute bottom-32 right-12 w-40 h-40 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-violet-400/10 to-indigo-400/10" />
        <div className="absolute top-1/2 right-8 w-24 h-24 rounded-full opacity-4 blur-2xl bg-gradient-to-r from-rose-400/8 to-pink-400/8" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-32 right-16 text-emerald-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={16} />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-12 text-violet-400/25"
        animate={{ y: [-3, 3] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={14} />
      </motion.div>

      <motion.div
        className="absolute top-48 left-20 text-indigo-400/20"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={12} />
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full relative z-10">
        {/* Bouton retour animé */}
        <motion.div
          variants={itemVariants}
          className="absolute top-16 left-0 w-full"
        >
          <motion.div
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/auth/register"
              className="text-black flex items-center gap-2 w-fit"
            >
              <ChevronLeft size={24} />
            </Link>
          </motion.div>
        </motion.div>

        {isVerifying ? (
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{ willChange: "transform" }}
            >
              <Loader2 className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.p
              className="text-muted-foreground"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Vérification en cours...
            </motion.p>
          </motion.div>
        ) : (
          <>
            {/* Titre animé */}
            <motion.h1
              className="text-2xl font-heading mb-2 text-center"
              variants={itemVariants}
            >
              Vérification de votre email
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-center mb-8"
              variants={itemVariants}
            >
              Entrez le code à 6 chiffres envoyé à
              <br />
              <motion.span
                className="font-medium text-primary-700"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {email}
              </motion.span>
            </motion.p>

            {/* Champ OTP animé */}
            <motion.div
              className="flex justify-center mb-8"
              variants={otpVariants}
            >
              <motion.div
                animate={isSuccess ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={setCode}
                  disabled={isVerifying || isLoading || isSuccess}
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
              className="w-full space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              {/* Bouton de vérification */}
              <Button
                className="w-full h-14 transition-colors duration-200"
                onClick={handleVerification}
                disabled={
                  code.length !== 6 || isVerifying || isLoading || isSuccess
                }
                asChild
              >
                <motion.button
                  whileHover={
                    code.length === 6 &&
                    !isVerifying &&
                    !isLoading &&
                    !isSuccess
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    code.length === 6 &&
                    !isVerifying &&
                    !isLoading &&
                    !isSuccess
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
                        Email vérifié !
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

              {/* Bouton de renvoi */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Button
                  variant="ghost"
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                  disabled={
                    timeLeft > 0 || isVerifying || isLoading || isSuccess
                  }
                  onClick={handleResendCode}
                  asChild
                >
                  <motion.button
                    whileHover={
                      timeLeft === 0 && !isVerifying && !isLoading && !isSuccess
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      timeLeft === 0 && !isVerifying && !isLoading && !isSuccess
                        ? { scale: 0.98 }
                        : {}
                    }
                    transition={{ duration: 0.15 }}
                  >
                    {timeLeft > 0 ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        Renvoyer dans {timeLeft}s
                      </motion.span>
                    ) : (
                      "Renvoyer le code"
                    )}
                  </motion.button>
                </Button>
              </motion.div>

              {/* Bouton d'annulation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Button
                  variant="ghost"
                  className="w-full h-12 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => {
                    sessionStorage.removeItem("verificationEmail");
                    router.push("/auth/login");
                  }}
                  disabled={isVerifying || isLoading || isSuccess}
                  asChild
                >
                  <motion.button
                    whileHover={
                      !isVerifying && !isLoading && !isSuccess
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      !isVerifying && !isLoading && !isSuccess
                        ? { scale: 0.98 }
                        : {}
                    }
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
              {code.length === 6 &&
                !isVerifying &&
                !isLoading &&
                !isSuccess && (
                  <motion.div
                    className="text-center mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.p
                      className="text-sm text-green-600 font-medium"
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
          </>
        )}

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
                className="text-center"
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
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                </motion.div>
                <motion.h2
                  className="text-xl font-heading text-green-600 mb-2"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Email vérifié avec succès !
                </motion.h2>
                <p className="text-muted-foreground">Redirection en cours...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
