import { redirect } from "next/navigation";
import React from "react";
import LoginForm from "@/app/(auth)/login/login-form";
import getCurrentSession from "@/server/auth/sessions";

export default async function LoginPage() {
  const { user } = await getCurrentSession();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <LoginForm />
    </div>
  );
}
