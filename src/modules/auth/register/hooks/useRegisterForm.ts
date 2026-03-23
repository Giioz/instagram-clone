import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

export function useRegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
    month: "",
    day: "",
    year: "",
  });

  const [usernameError, setUsernameError] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (registerData: {
      email: string;
      password: string;
      name: string;
      username: string;
      birthday: string;
    }) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      return data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      router.push("/login");
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "An error occurred");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!formData.month || !formData.day || !formData.year) {
      setError("Please complete your birthday");
      return;
    }
    
    const birthday = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;

    registerMutation.mutate({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      username: formData.username,
      birthday,
    });
  };

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString(),
  }));

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: 100 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  return {
    formData,
    setFormData,
    usernameError,
    setUsernameError,
    isLoading: registerMutation.isPending,
    error,
    handleChange,
    handleSubmit,
    months,
    days,
    years,
  };
}
