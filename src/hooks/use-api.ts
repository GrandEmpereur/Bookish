import {
  QueryKey,
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import { apiRequest } from "@/lib/api-client";

// Generic GET query helper
export function useApiQuery<T>(
  key: QueryKey,
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiRequest<T>("GET", endpoint, { params }),
    ...options,
  });
}

// Generic mutation helper (POST / PATCH / PUT / DELETE)
export function useApiMutation<TResponse = unknown, TVariables = unknown>(
  endpoint: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST",
  options?: UseMutationOptions<TResponse, Error, TVariables>
) {
  return useMutation<TResponse, Error, TVariables>({
    mutationFn: (variables: TVariables) =>
      apiRequest<TResponse>(method, endpoint, { data: variables }),
    ...options,
  });
}
