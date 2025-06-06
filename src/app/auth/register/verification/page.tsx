"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
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

  const handleVerification = async () => {
    if (code.length !== 6) {
      toast.error("Le code doit contenir 6 chiffres");
      return;
    }

    try {
      setIsVerifying(true);
      const data: VerifyEmailRequest = { email, code };
      await verifyEmail(data);
      router.replace("/auth/register/purpose");
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

  return (
    <div className="min-h-dvh flex flex-col px-5 bg-background">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full -mt-20">
        {isVerifying ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Vérification en cours...</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-heading mb-2 text-center">
              Vérification de votre email
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Entrez le code à 6 chiffres envoyé à
              <br />
              {email}
            </p>

            <div className="flex justify-center mb-8">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                disabled={isVerifying || isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-14"
              onClick={handleVerification}
              disabled={code.length !== 6 || isVerifying || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                "Vérifier"
              )}
            </Button>

            <Button
              variant="ghost"
              className="mt-4 text-sm text-muted-foreground"
              disabled={timeLeft > 0 || isVerifying || isLoading}
              onClick={handleResendCode}
            >
              {timeLeft > 0 ? `Renvoyer dans ${timeLeft}s` : "Renvoyer le code"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
