import axios, { AxiosError, AxiosInstance } from "axios";
import { ApiError } from "@/types/apiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    throw new Error(
      axiosError.response?.data.message || "An unknown error occurred"
    );
  } else {
    throw new Error("An unmanaged error occurred");
  }
};

export { apiClient, handleApiError };
