"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Mail, Sparkles, Heart } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { useAuth } from "@/contexts/auth-context";
import type { ForgotPasswordRequest } from "@/types/authTypes";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailToReset, setEmailToReset] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { requestPasswordReset } = useAuth();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: ForgotPasswordInput) => {
    try {
      const data: ForgotPasswordRequest = {
        email: formData.email,
      };

      await requestPasswordReset(data);

      // Stocker l'email pour la vérification
      setEmailToReset(formData.email);
      sessionStorage.setItem("resetPasswordEmail", formData.email);
      setIsSuccess(true);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Afficher le dialogue de confirmation
      setShowEmailDialog(true);
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const handleDialogClose = (open: boolean) => {
    setShowEmailDialog(open);
    if (!open) {
      router.push("/auth/forgot-password/verify");
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
        <div className="absolute top-20 left-8 w-28 sm:w-36 h-28 sm:h-36 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-blue-400/10 to-purple-400/10" />
        <div className="absolute bottom-24 right-12 w-36 sm:w-44 h-36 sm:h-44 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-primary/12 to-accent/12" />
        <div className="absolute top-1/2 right-4 w-20 sm:w-24 h-20 sm:h-24 rounded-full opacity-4 blur-2xl bg-gradient-to-r from-pink-400/8 to-orange-400/8" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-24 right-12 text-blue-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-8 text-purple-400/25"
        animate={{ y: [-4, 4] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={14} className="sm:w-4 sm:h-4" />
      </motion.div>

      <motion.div
        className="absolute top-40 left-16 text-pink-400/20"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={10} className="sm:w-3 sm:h-3" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 right-8 text-indigo-400/15"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={12} className="sm:w-[14px] sm:h-[14px]" />
      </motion.div>

      <div className="flex-1 flex flex-col max-w-sm sm:max-w-md mx-auto w-full justify-center relative z-10">
        {/* Bouton retour animé */}
        <motion.div variants={itemVariants} className="mb-8 pt-[60px]">
          <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}>
            <Link
              href="/auth/login"
              className="text-black flex items-center gap-2 w-fit"
            >
              <ChevronLeft size={22} className="sm:w-6 sm:h-6" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Titre animé */}
        <motion.h1
          className="text-[28px] sm:text-[32px] font-heading leading-tight mb-4"
          variants={itemVariants}
        >
          Mot de passe oublié ?
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8 text-sm sm:text-base"
          variants={itemVariants}
        >
          Entrez votre email pour recevoir un lien de réinitialisation
        </motion.p>

        {/* Formulaire animé */}
        <motion.div variants={formVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
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
                          className="h-12 sm:h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500 transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                          disabled={form.formState.isSubmitting || isSuccess}
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 sm:h-14 bg-primary-800 hover:bg-primary-900 text-white transition-colors duration-200"
                  disabled={form.formState.isSubmitting || isSuccess}
                  asChild
                >
                  <motion.button
                    whileTap={
                      !form.formState.isSubmitting && !isSuccess
                        ? { scale: 0.98 }
                        : {}
                    }
                    transition={{ duration: 0.15 }}
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
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </motion.div>
                      ) : isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center"
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
                          Email envoyé !
                        </motion.div>
                      ) : (
                        <motion.span
                          key="send"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Envoyer le lien
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>
      </div>

      <Dialog open={showEmailDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md mx-4 sm:mx-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader>
              <motion.div
                className="mx-auto bg-primary-100 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary-800" />
              </motion.div>
              <DialogTitle className="text-center font-heading text-xl sm:text-2xl">
                Vérifiez vos emails
              </DialogTitle>
              <DialogDescription className="text-center text-sm sm:text-base">
                Si un compte existe avec cet email, vous recevrez un lien de
                réinitialisation.
                <br />
                Veuillez vérifier votre boîte de réception.
              </DialogDescription>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
