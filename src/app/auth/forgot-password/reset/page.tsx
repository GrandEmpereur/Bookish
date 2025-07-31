"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Heart,
  CheckCircle,
  Lock,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { useAuth } from "@/contexts/auth-context";
import type { ResetPasswordRequest } from "@/types/authTypes";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Récupérer et définir l'email au chargement
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("resetPasswordEmail");
    if (!storedEmail) {
      router.replace("/auth/forgot-password");
      return;
    }
    // Définir l'email dans le formulaire
    form.setValue("email", storedEmail);
  }, [router, form]);

  const onSubmit = async (formData: ResetPasswordInput) => {
    try {
      const data: ResetPasswordRequest = {
        email: formData.email,
        newPassword: formData.newPassword,
      };

      await resetPassword(data);
      setIsSuccess(true);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      // Attendre un peu pour montrer le succès puis rediriger
      setTimeout(() => {
        // Nettoyage et redirection
        sessionStorage.removeItem("resetPasswordEmail");
        router.replace("/auth/login");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error); // Debug log
      toast.error(
        error.message || "Une erreur est survenue lors de la réinitialisation"
      );
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

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2,

      },
    },
  };

  return (
    <motion.div
      className="min-h-dvh flex flex-col px-5 bg-gradient-to-br from-background via-background to-muted/20 safe-area-pt relative overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-8 w-28 sm:w-36 h-28 sm:h-36 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-blue-400/15 to-cyan-400/15" />
        <div className="absolute bottom-32 left-12 w-24 sm:w-28 h-24 sm:h-28 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-green-400/10 to-emerald-400/10" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-24 left-8 text-cyan-400/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={18} className="sm:w-5 sm:h-5" />
      </motion.div>

      <motion.div
        className="absolute bottom-48 right-8 text-green-400/20"
        animate={{ y: [-4, 4] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={16} className="sm:w-[18px] sm:h-[18px]" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-16 text-blue-400/15"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ willChange: "transform" }}
      >
        <Lock size={14} className="sm:w-4 sm:h-4" />
      </motion.div>

      <div className="flex-1 flex flex-col max-w-sm sm:max-w-md mx-auto w-full justify-center relative z-10">
        {/* Titre animé */}
        <motion.h1
          className="text-[32px] font-heading leading-tight mb-4"
          variants={itemVariants}
        >
          Nouveau mot de passe
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8"
          variants={itemVariants}
        >
          Choisissez un nouveau mot de passe sécurisé
        </motion.p>

        {/* Formulaire animé */}
        <motion.div variants={formVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Champ nouveau mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nouveau mot de passe"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500 pr-12 transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                            disabled={form.formState.isSubmitting || isSuccess}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-14 px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSuccess}
                            asChild
                          >
                            <motion.button
                              whileHover={!isSuccess ? { scale: 1.1 } : {}}
                              whileTap={!isSuccess ? { scale: 0.9 } : {}}
                              transition={{ duration: 0.15 }}
                            >
                              <motion.div
                                animate={{ rotateY: showPassword ? 180 : 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                style={{ willChange: "transform" }}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-5 w-5 text-muted-foreground" />
                                )}
                              </motion.div>
                            </motion.button>
                          </Button>
                        </div>
                      </FormControl>
                      <AnimatePresence>
                        {form.formState.errors.newPassword && (
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

              {/* Champ confirmation mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirmer le mot de passe"
                            className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500 pr-12 transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                            disabled={form.formState.isSubmitting || isSuccess}
                          />
                        </div>
                      </FormControl>
                      <AnimatePresence>
                        {form.formState.errors.confirmPassword && (
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

              {/* Bouton de soumission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full h-14 transition-colors duration-200"
                  disabled={form.formState.isSubmitting || isSuccess}
                  asChild
                >
                  <motion.button
                    whileHover={
                      !form.formState.isSubmitting && !isSuccess
                        ? { scale: 1.02 }
                        : {}
                    }
                    whileTap={
                      !form.formState.isSubmitting && !isSuccess
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
                      {form.formState.isSubmitting ? (
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
                          Réinitialisation...
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
                          Mot de passe mis à jour !
                        </motion.div>
                      ) : (
                        <motion.span
                          key="reset"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Réinitialiser le mot de passe
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Button>
              </motion.div>
            </form>
          </Form>
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
                  <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-heading text-green-600 mb-2"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  Mot de passe réinitialisé !
                </motion.h2>
                <motion.p
                  className="text-muted-foreground mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Votre mot de passe a été mis à jour avec succès.
                </motion.p>
                <motion.p
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Redirection vers la connexion...
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
