import LoginForm from "@/app/(auth)/login/login-form";
import getCurrentSession from "@/server/auth/sessions";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoginPage() {
  const { user } = await getCurrentSession();

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <LoginForm />
    </div>
  );
}
