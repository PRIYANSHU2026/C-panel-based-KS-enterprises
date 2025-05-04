"use client";

import { Toaster, toast } from "sonner";
import { WelcomeForm } from "@/components/ui/welcome-form";
import { useState, useEffect } from "react";

export function ClientBody({ children }: { children: React.ReactNode }) {
  const [showWelcomeForm, setShowWelcomeForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if the form has been submitted before
    const hasSubmitted = localStorage.getItem("welcomeFormSubmitted");

    if (!hasSubmitted) {
      setShowWelcomeForm(true);
    }
  }, []);

  const handleFormSubmit = (data: {
    name: string;
    phone: string;
    email: string;
    address: string;
  }) => {
    // Handle the form submission data here
    console.log("Form submitted with data:", data);

    // Save submission status to localStorage
    localStorage.setItem("welcomeFormSubmitted", "true");

    // Show a success toast
    toast.success("Thank you for providing your details!");

    // Hide the welcome form
    setShowWelcomeForm(false);
  };

  return (
    <>
      <Toaster position="top-center" closeButton richColors />
      {children}
      {mounted && showWelcomeForm && <WelcomeForm onSubmit={handleFormSubmit} />}
    </>
  );
}
