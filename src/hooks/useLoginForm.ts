import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginStore } from "../store/loginStore";

export function useLoginForm() {
  const {
    email,
    password,
    errors: fieldErrors,
    isLoading,
    setEmail,
    setPassword,
    validateEmail,
    validatePassword,
    validateForm,
    resetErrors,
    setLoading,
  } = useLoginStore();

  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
    
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      resetErrors();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          useLoginStore.setState({ errors: data.errors });
          return;
        }
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData: { email, password },
    setFormData: (data: { email?: string; password?: string }) => {
      if (data.email !== undefined) setEmail(data.email);
      if (data.password !== undefined) setPassword(data.password);
    },
    isLoading,
    error,
    fieldErrors,
    handleChange,
    handleSubmit,
  };
}
