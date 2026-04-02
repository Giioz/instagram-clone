import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export function useVerifyEmailForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const verifyMutation = useMutation({
    mutationFn: async (verificationData: { code: string }) => {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      return data;
    },
    onSuccess: (data) => {
      console.log("Verification successful:", data);
      router.push("/login");
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "An error occurred");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCode(value.slice(0, 6));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (code.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    verifyMutation.mutate({ code });
  };

  return {
    code,
    setCode,
    isLoading: verifyMutation.isPending,
    error,
    handleChange,
    handleSubmit,
  };
}
