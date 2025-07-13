"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Sparkles, Heart } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import type { LoginRequest } from "@/types/authTypes";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { login } = useAuth();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (formData: LoginInput) => {
    setIsSubmitting(true);
    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };

      await login(loginData);

      // Animation de succès avant redirection
      setIsSuccess(true);
      setIsSubmitting(false);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Délai pour l'animation de sortie
      setTimeout(() => {
        // La redirection sera gérée par useAuth automatiquement
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "Vérifiez vos identifiants et réessayez");
      console.error("Login error:", error);
      setIsSubmitting(false);
    }
  };

  // Animation variants optimisées
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
      scale: 1.1,
      y: -50,
      transition: {
        duration: 0.8,
        ease: [0.32, 0, 0.67, 0],
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const formVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const successVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-dvh flex flex-col px-5 pt-[60px] bg-gradient-to-br from-background via-background to-muted/20 justify-center items-center relative overflow-hidden"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key={isSuccess ? "success" : "login"}
      >
        {/* Arrière-plan décoratif optimisé */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          animate={isSuccess ? { opacity: 0.3 } : { opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cercles de blur statiques pour les performances */}
          <div className="absolute top-10 left-10 w-40 sm:w-60 h-40 sm:h-60 rounded-full opacity-10 blur-3xl bg-gradient-to-r from-primary/20 to-primary-600/20" />
          <div className="absolute bottom-10 right-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-secondary/15 to-accent/15" />
        </motion.div>

        {/* Éléments graphiques décoratifs simplifiés */}
        <motion.div
          className="absolute top-20 left-8 text-yellow-400/30"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ willChange: "transform" }}
        >
          <Sparkles size={16} className="sm:w-5 sm:h-5" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-12 text-pink-400/25"
          animate={{
            y: [-4, 4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        >
          <Heart size={14} className="sm:w-[18px] sm:h-[18px]" />
        </motion.div>

        {/* Animation de succès */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-20"
              variants={successVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/30 shadow-2xl text-center max-w-xs sm:max-w-sm"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    className="text-green-400 text-xl sm:text-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    ✓
                  </motion.div>
                </motion.div>
                <motion.h2
                  className="text-white text-lg sm:text-xl font-heading mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Connexion réussie !
                </motion.h2>
                <motion.p
                  className="text-white/70 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Redirection en cours...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu principal */}
        <motion.div
          className="relative z-10 w-full max-w-[350px] sm:max-w-[400px]"
          animate={
            isSuccess ? { opacity: 0.5, scale: 0.95 } : { opacity: 1, scale: 1 }
          }
          transition={{ duration: 0.5 }}
        >
          {/* Titre animé optimisé */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 sm:mb-14"
          >
            <motion.h1
              className="text-[28px] sm:text-[32px] font-heading leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              Connectez-vous
              <br />
              <span className="relative inline-block">
                à votre compte
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  style={{ transformOrigin: "left", willChange: "transform" }}
                />
              </span>
            </motion.h1>
          </motion.div>

          {/* Formulaire animé optimisé */}
          <motion.div variants={formVariants}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
              >
                <motion.div className="space-y-4" variants={itemVariants}>
                  {/* Champ Email */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Adresse e-mail"
                              className="h-12 sm:h-14 bg-accent-100 border-0 text-base pr-12 transition-shadow duration-200 focus:shadow-lg focus:shadow-primary/10"
                              disabled={isSubmitting || isSuccess}
                            />
                          </FormControl>
                          <AnimatePresence>
                            {form.formState.errors.email && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FormMessage />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  {/* Champ Mot de passe */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                  >
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Mot de passe"
                                className="h-12 sm:h-14 bg-accent-100 border-0 text-base pr-12 transition-shadow duration-200 focus:shadow-lg focus:shadow-primary/10"
                                disabled={isSubmitting || isSuccess}
                              />
                              <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-500 hover:text-muted-700 transition-colors"
                                disabled={isSubmitting || isSuccess}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                              >
                                <AnimatePresence mode="wait">
                                  {showPassword ? (
                                    <motion.div
                                      key="eyeoff"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <EyeOff
                                        size={18}
                                        className="sm:w-5 sm:h-5"
                                      />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      key="eye"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      <Eye
                                        size={18}
                                        className="sm:w-5 sm:h-5"
                                      />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            </div>
                          </FormControl>
                          <AnimatePresence>
                            {form.formState.errors.password && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FormMessage />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </motion.div>

                {/* Mot de passe oublié */}
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Link
                      href="/auth/forgot-password"
                      className="text-secondary-500 text-sm sm:text-base hover:text-secondary-600 transition-colors"
                      tabIndex={isSubmitting || isSuccess ? -1 : 0}
                    >
                      Mot de passe oublié ?
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Bouton de connexion */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                >
                  <Button
                    type="submit"
                    className="h-12 sm:h-14 bg-primary-800 hover:bg-primary-900 text-white mt-4 w-full transition-colors duration-200"
                    disabled={isSubmitting || isSuccess}
                    asChild
                  >
                    <motion.button
                      whileTap={
                        !isSubmitting && !isSuccess ? { scale: 0.98 } : {}
                      }
                      transition={{ duration: 0.15 }}
                    >
                      <AnimatePresence mode="wait">
                        {isSubmitting ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center"
                            transition={{ duration: 0.15 }}
                          >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion en cours...
                          </motion.div>
                        ) : isSuccess ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center"
                            transition={{ duration: 0.3 }}
                          >
                            <motion.span
                              className="mr-2 text-green-400"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              ✓
                            </motion.span>
                            Connecté !
                          </motion.div>
                        ) : (
                          <motion.span
                            key="connect"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                          >
                            Connexion
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </Button>
                </motion.div>

                {/* Lien d'inscription */}
                <motion.p
                  className="text-center mt-4 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSuccess ? 0.5 : 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  Vous n'avez pas de compte ?{" "}
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                    className="inline-block"
                    transition={{ duration: 0.1 }}
                  >
                    <Link
                      href="/auth/register"
                      className="text-secondary-500 font-medium hover:text-secondary-600 transition-colors"
                      tabIndex={isSubmitting || isSuccess ? -1 : 0}
                    >
                      Créez un compte
                    </Link>
                  </motion.span>
                </motion.p>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
