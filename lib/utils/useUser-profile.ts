import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { fetchUserById } from "@/hooks/querys/userById"

export const useUserProfile = () => {
  const { useSession } = authClient;
  const { data: session, isPending: sessionPending } = useSession();
  const userId = session?.user?.id;

  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: fetchUserById,
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
    retry: 1,
  });

  return {
    session,
    sessionPending,
    userProfile: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};