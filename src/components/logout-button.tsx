"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { LogOut, LoaderCircle } from "lucide-react";
import { globalSuccessToast, globalErrorToast } from "@/lib/toast";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export default function LogoutButton({
  variant = "outline",
  size = "default",
  className,
  showIcon = true,
}: LogoutButtonProps) {
  const router = useRouter();
  const utils = api.useUtils();

  const logoutMutation = api.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.invalidate();
      globalSuccessToast("Logged out successfully");
      router.push("/");
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to logout");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className={className}
    >
      {logoutMutation.isPending ? (
        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        showIcon && <LogOut className="mr-2 h-4 w-4" />
      )}
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
