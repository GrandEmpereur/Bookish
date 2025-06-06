"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { UserProfile as User } from "@/types/userTypes";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  RegisterStepOneRequest,
  RegisterStepTwoRequest,
  RegisterStepThreeRequest,
  ForgotPasswordRequest,
  VerifyResetCodeRequest,
  ResetPasswordRequest,
  RegisterResponse,
  AuthResponse,
} from "@/types/authTypes";
import { toast } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<AuthResponse<RegisterResponse>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  verifyEmail: (data: VerifyEmailRequest) => Promise<void>;
  resendVerification: (data: ResendVerificationRequest) => Promise<void>;
  completeStepOne: (data: RegisterStepOneRequest) => Promise<void>;
  completeStepTwo: (data: RegisterStepTwoRequest) => Promise<void>;
  completeStepThree: (data: RegisterStepThreeRequest) => Promise<void>;
  requestPasswordReset: (data: ForgotPasswordRequest) => Promise<void>;
  verifyResetCode: (data: VerifyResetCodeRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </QueryClientProvider>
  );
}

function AuthProviderInner({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const {
    data: profileData,
    isError: profileIsError,
    error: profileError,
    isLoading: profileLoading,
    isFetching: profileFetching,
  } = useQuery({
    queryKey: ["me"],
    queryFn: () => userService.getAuthenticatedProfile(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const isLoading = profileLoading || profileFetching;

  useEffect(() => {
    if (profileData) {
      setUser(profileData.data);
    }

    if (profileIsError && (profileError as any)?.status === 401) {
      setUser(null);
    }
  }, [profileData, profileIsError, profileError]);

  // ---------------- Mutations ----------------
  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Connexion réussie", {
        description: "Bienvenue sur Bookish !",
      });
      router.replace("/feed");
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Une erreur est survenue lors de la connexion"
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onError: (error: any) => {
      toast.error(
        error.message || "Une erreur est survenue lors de l'inscription"
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Nettoyer uniquement les cookies d'authentification
      const cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

        // Supprimer uniquement les cookies d'authentification spécifiques
        if (
          name &&
          (name.includes("adonis-session") ||
            name.includes("rememberMe") ||
            name.includes("remember_"))
        ) {
          document.cookie = `${name}=; Path=/;`;
        }
      }

      setUser(null);
      queryClient.clear();
      router.replace("/auth/login");
      toast.success("Déconnexion réussie", { description: "À bientôt !" });
    },
    onError: (error: any) => {
      toast.error(
        error.message || "Une erreur est survenue lors de la déconnexion"
      );
    },
  });

  const login = async (data: LoginRequest): Promise<void> => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterRequest) =>
    registerMutation.mutateAsync(data);

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  const refreshUser = async () => {
    await queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  const verifyEmail = async (data: VerifyEmailRequest) => {
    try {
      await authService.verifyEmail(data);
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors de la vérification"
      );
      throw error;
    }
  };

  const resendVerification = async (data: ResendVerificationRequest) => {
    try {
      await authService.resendVerification(data);
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors du renvoi du code"
      );
      throw error;
    }
  };

  const completeStepOne = async (data: RegisterStepOneRequest) => {
    try {
      await authService.completeStep1(data);
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors de la sélection"
      );
      throw error;
    }
  };

  const completeStepTwo = async (data: RegisterStepTwoRequest) => {
    try {
      await authService.completeStep2(data);
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors de la sélection"
      );
      throw error;
    }
  };

  const completeStepThree = async (data: RegisterStepThreeRequest) => {
    try {
      await authService.completeStep3(data);
    } catch (error: any) {
      toast.error(
        error.message || "Une erreur est survenue lors de la sélection"
      );
      throw error;
    }
  };

  const requestPasswordReset = async (data: ForgotPasswordRequest) => {
    try {
      await authService.requestPasswordReset(data);
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
      throw error;
    }
  };

  const verifyResetCode = async (data: VerifyResetCodeRequest) => {
    try {
      await authService.verifyResetCode(data);
    } catch (error: any) {
      toast.error(error.message || "Code invalide");
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      await authService.resetPassword(data);
      toast.success("Votre mot de passe a été réinitialisé");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
        verifyEmail,
        resendVerification,
        completeStepOne,
        completeStepTwo,
        completeStepThree,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
