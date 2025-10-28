"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ViewAsViewType } from "@/types/view-as.types";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ModeViewAsProps {
  className?: string;
}

export function ModeViewAs({ className }: ModeViewAsProps) {
  const [isClient, setIsClient] = useState(false);
  const utils = api.useUtils();

  const { data: viewAsData, isLoading } = api.viewAs.getViewAs.useQuery();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const setViewAsMutation = api.viewAs.setViewAs.useMutation({
    onSuccess: () => {
      utils.viewAs.getViewAs.invalidate();
    },
  });

  // Don't render until client is ready to prevent hydration mismatch
  if (!isClient) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("hidden w-20 md:flex", className)}
        disabled
      >
        GUEST
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("hidden w-20 md:flex", className)}
          disabled={isLoading || setViewAsMutation.isPending}
        >
          {isLoading || setViewAsMutation.isPending ? (
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            viewAsData?.data.value ?? "GUEST"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            setViewAsMutation.mutate({ value: ViewAsViewType.GUEST })
          }
          disabled={setViewAsMutation.isPending}
        >
          GUEST
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setViewAsMutation.mutate({ value: ViewAsViewType.ADMIN });
          }}
          disabled={setViewAsMutation.isPending}
        >
          ADMIN
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
