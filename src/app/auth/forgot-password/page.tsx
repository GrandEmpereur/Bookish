"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

      // Retour haptique sur mobile
      if (navigator.vibrate) {
        navigator.vibrate(100);
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

  return (
    <div className="min-h-dvh flex flex-col px-5 bg-background safe-area-pt">
      <div className="flex-1 flex flex-col max-w-md mx-auto w-full justify-center">
        <Link
          href="/auth/login"
          className="text-black mb-8 flex items-center gap-2 pt-[60px]"
        >
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-[32px] font-heading leading-tight mb-4">
          Mot de passe oublié ?
        </h1>
        <p className="text-muted-foreground mb-8">
          Entrez votre email pour recevoir un lien de réinitialisation
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email"
                      className="h-14 bg-accent-100 border-0 text-base placeholder:text-muted-500"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-14 bg-primary-800 hover:bg-primary-900 text-white"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer le lien"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={showEmailDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary-800" />
            </div>
            <DialogTitle className="text-center font-heading text-2xl">
              Vérifiez vos emails
            </DialogTitle>
            <DialogDescription className="text-center">
              Si un compte existe avec cet email, vous recevrez un lien de
              réinitialisation.
              <br />
              Veuillez vérifier votre boîte de réception.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
