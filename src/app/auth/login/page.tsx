"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginInput } from "@/validations/auth";
import type { LoginRequest } from "@/types/authTypes";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };
      console.log(loginData);

      const response = await login(loginData);
      console.log(response);

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message || "Vérifiez vos identifiants et réessayez",
      });
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col px-5 pt-[60px] bg-background justify-center items-center">
      {/* Titre */}
      <h1 className="text-[32px] text-center font-heading leading-tight mb-14">
        Connectez-vous
        <br />à votre compte
      </h1>

      {/* Formulaire */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full max-w-[400px]"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="votre@email.com"
                      className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        className="h-14 bg-accent-100 border-0 text-base pr-12"
                        disabled={form.formState.isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-500 hover:text-muted-700 transition-colors"
                        disabled={form.formState.isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Mot de passe oublié */}
          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-secondary-500 text-base"
              tabIndex={form.formState.isSubmitting ? -1 : 0}
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            className="h-14 bg-primary-800 hover:bg-primary-900 text-white mt-4"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Connexion"
            )}
          </Button>

          {/* Lien d'inscription */}
          <p className="text-center mt-4 text-base">
            Vous n'avez pas de compte ?{" "}
            <Link
              href="/auth/register"
              className="text-secondary-500 font-medium"
              tabIndex={form.formState.isSubmitting ? -1 : 0}
            >
              Créez un compte
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
}
