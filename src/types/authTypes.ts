import type {
  UserProfile,
  UserRole,
  UsagePurpose,
  ReadingHabit,
} from "./userTypes";

// Types pour les requêtes
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    birthDate: string;
}

export interface RegisterStep1Request {
  email: string;
  usagePurpose: string;
}

export interface RegisterStep2Request {
  email: string;
  readingHabit: string;
}

export interface RegisterStep3Request {
  email: string;
  preferredGenres: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface RegisterStepOneRequest {
  email: string;
  usagePurpose: UsagePurpose;
}

export interface RegisterStepTwoRequest {
  email: string;
  readingHabit: ReadingHabit;
}

export interface RegisterStepThreeRequest {
  email: string;
  preferredGenres: string[];
}

// Types pour les réponses
export interface ApiBaseResponse {
  status: "success" | "error" | "fail";
  message: string;
}

export interface LoginResponse extends ApiBaseResponse {
  data: {
    id: string;
    username: string;
    email: string;
    is_verified: boolean;
    has_logged_in: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface RegisterResponse extends ApiBaseResponse {
  data: {
    id: string;
    username: string;
    email: string;
    created_at: string;
  };
}

export interface RegisterStep1Response extends ApiBaseResponse {
  data: {
    usagePurpose: string;
  };
}

export interface RegisterStep2Response extends ApiBaseResponse {
  data: {
    readingHabit: string;
  };
}

export interface RegisterStep3Response extends ApiBaseResponse {
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      is_verified: boolean;
    };
    preferences: {
      readingHabit: string;
      usagePurpose: string;
      genres: string[];
    };
  };
}

export interface VerifyEmailResponse extends ApiBaseResponse {}

export interface ResendVerificationResponse extends ApiBaseResponse {}

export interface RequestPasswordResetResponse extends ApiBaseResponse {}

export interface VerifyResetCodeResponse extends ApiBaseResponse {}

export interface ResetPasswordResponse extends ApiBaseResponse {}

export interface LogoutResponse extends ApiBaseResponse {}

export interface RegisterStepOneResponse {
  status: "success";
  message: string;
}

export interface RegisterStepTwoResponse {
  status: "success";
  message: string;
}

export interface RegisterStepThreeResponse {
  status: "success";
  message: string;
}

// Type générique pour les réponses d'erreur
export interface ApiErrorResponse extends ApiBaseResponse {
  status: "error" | "fail";
  message: string;
}

// Type pour les réponses d'authentification
export type AuthResponse<T> = T & ApiBaseResponse;

// Interface du service d'authentification
export interface AuthService {
  register(data: RegisterRequest): Promise<RegisterResponse>;
  completeStep1(data: RegisterStep1Request): Promise<RegisterStep1Response>;
  completeStep2(data: RegisterStep2Request): Promise<RegisterStep2Response>;
  completeStep3(data: RegisterStep3Request): Promise<RegisterStep3Response>;
  login(data: LoginRequest): Promise<LoginResponse>;
  verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse>;
  resendVerification(
    data: ResendVerificationRequest
  ): Promise<ResendVerificationResponse>;
  requestPasswordReset(
    data: ForgotPasswordRequest
  ): Promise<RequestPasswordResetResponse>;
  verifyResetCode(
    data: VerifyResetCodeRequest
  ): Promise<VerifyResetCodeResponse>;
  resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  logout(): Promise<LogoutResponse>;
  completeStepOne(
    data: RegisterStepOneRequest
  ): Promise<RegisterStepOneResponse>;
  completeStepTwo(
    data: RegisterStepTwoRequest
  ): Promise<RegisterStepTwoResponse>;
  completeStepThree(
    data: RegisterStepThreeRequest
  ): Promise<RegisterStepThreeResponse>;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  // ... autres champs
}
