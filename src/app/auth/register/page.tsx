"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Sparkles,
  Heart,
  CheckCircle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import type { RegisterRequest } from "@/types/authTypes";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

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

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      birthDate: "",
    },
  });

  const handleDialogClose = () => {
    setShowEmailDialog(false);
    router.push("/auth/register/verification");
  };

  const onSubmit = async (data: RegisterInput) => {
    try {
      const isValid = await form.trigger();
      if (!isValid) return;

      setIsLoading(true);

      const [day, month, year] = data.birthDate.split("/");
      const formattedDate = `${year}-${month}-${day}`;

      const requestData: RegisterRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        birthDate: formattedDate,
      };

      const response = await register(requestData);
      setIsSuccess(true);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      sessionStorage.setItem("verificationEmail", data.email);
      setShowEmailDialog(true);
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
      className="min-h-dvh flex flex-col px-5 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-8 w-32 sm:w-40 h-32 sm:h-40 rounded-full opacity-6 blur-3xl bg-gradient-to-r from-green-400/10 to-blue-400/10" />
        <div className="absolute bottom-20 left-12 w-28 sm:w-36 h-28 sm:h-36 rounded-full opacity-8 blur-3xl bg-gradient-to-r from-purple-400/12 to-pink-400/12" />
        <div className="absolute top-1/3 left-6 w-24 sm:w-28 h-24 sm:h-28 rounded-full opacity-4 blur-2xl bg-gradient-to-r from-yellow-400/8 to-orange-400/8" />
      </div>

      {/* Éléments décoratifs */}
      <motion.div
        className="absolute top-16 right-12 text-green-400/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={18} className="sm:w-5 sm:h-5" />
      </motion.div>

      <motion.div
        className="absolute bottom-28 left-8 text-purple-400/25"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
      </motion.div>

      <motion.div
        className="absolute top-36 left-16 text-blue-400/20"
        animate={{ y: [-4, 4] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      >
        <Heart size={12} className="sm:w-[14px] sm:h-[14px]" />
      </motion.div>

      <div className="flex-1 flex flex-col max-w-sm sm:max-w-md mx-auto w-full justify-center relative z-10">
        {/* Titre animé */}
        <motion.h1
          className="text-[28px] sm:text-[32px] text-center font-heading leading-tight mb-8 sm:mb-14"
          variants={itemVariants}
        >
          Créez votre compte
        </motion.h1>

        {/* Formulaire animé */}
        <motion.div variants={formVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Champ nom d'utilisateur */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Prénom"
                          className="h-12 sm:h-14 bg-accent-100 border-0 text-base"
                          disabled={isLoading || isSuccess}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Nom"
                          className="h-12 sm:h-14 bg-accent-100 border-0 text-base"
                          disabled={isLoading || isSuccess}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* Champ nom d'utilisateur */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Nom d'utilisateur"
                          className="h-12 sm:h-14 bg-accent-100 border-0 text-base transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                          disabled={isLoading || isSuccess}
                          {...field}
                        />
                      </FormControl>
                      <AnimatePresence>
                        {form.formState.errors.username && (
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

              {/* Champ email */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email"
                          className="h-12 sm:h-14 bg-accent-100 border-0 text-base transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                          disabled={isLoading || isSuccess}
                          {...field}
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

              {/* Champ date de naissance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Date de naissance (JJ/MM/AAAA)"
                          className="h-12 sm:h-14 bg-accent-100 border-0 text-base transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                          disabled={isLoading || isSuccess}
                          {...field}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2)
                              value = value.slice(0, 2) + "/" + value.slice(2);
                            if (value.length >= 5)
                              value = value.slice(0, 5) + "/" + value.slice(5);
                            if (value.length > 10) value = value.slice(0, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <AnimatePresence>
                        {form.formState.errors.birthDate && (
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

              {/* Champ mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mot de passe"
                            className="h-12 sm:h-14 bg-accent-100 border-0 text-base pr-12 transition-all duration-200 focus:shadow-lg focus:shadow-primary/10"
                            disabled={isLoading || isSuccess}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-12 sm:h-14 px-3 py-2 hover:bg-transparent"
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
                                  <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                )}
                              </motion.div>
                            </motion.button>
                          </Button>
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

              {/* Texte d'aide */}
              <motion.p
                className="text-xs sm:text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                Le mot de passe doit avoir au moins 8 caractères
              </motion.p>

              {/* Bouton de soumission */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 sm:h-14 transition-colors duration-200"
                  disabled={isLoading || isSuccess}
                  asChild
                >
                  <motion.button
                    whileHover={!isLoading && !isSuccess ? { scale: 1.02 } : {}}
                    whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
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
                          Inscription en cours...
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
                          Compte créé !
                        </motion.div>
                      ) : (
                        <motion.span
                          key="register"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          S'inscrire
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </Button>
              </motion.div>
            </form>
          </Form>
        </motion.div>

        {/* Lien de connexion */}
        <motion.p
          className="text-center mt-4 text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          Vous avez un compte ?{" "}
          <motion.span transition={{ duration: 0.2 }}>
            <Link
              href="/auth/login"
              className="text-secondary-500 font-medium hover:text-secondary-600 transition-colors"
              tabIndex={form.formState.isSubmitting ? -1 : 0}
            >
              Connectez vous
            </Link>
          </motion.span>
        </motion.p>
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
                Nous avons envoyé un code de vérification à votre adresse email.
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
