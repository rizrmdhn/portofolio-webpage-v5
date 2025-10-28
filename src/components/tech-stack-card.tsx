import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { TechStack } from "@/types/tech-stack.types";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { Button } from "./ui/button";
import { Edit, LoaderCircle, Trash2 } from "lucide-react";

interface TechStackCardProps extends TechStack {}

export default function TechStackCard({ id, name, list }: TechStackCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();

  const { data: me } = api.auth.me.useQuery();

  const deleteTechStackMutation = api.techStack.delete.useMutation({
    onSuccess: () => {
      globalSuccessToast("Tech Stack deleted successfully");
      utils.techStack.getAll.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to delete tech stack");
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  return (
    <Card key={id} className="group relative overflow-hidden">
      {/* Edit/Delete buttons - Only show on hover for authenticated users */}
      {me && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 cursor-pointer shadow-sm"
            onClick={() => router.push(`/tech-stack/${id}/edit`)}
            onMouseEnter={() => {
              utils.techStack.getById.prefetch({ id });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 cursor-pointer shadow-sm"
                disabled={deleteTechStackMutation.isPending}
                onClick={() => setIsOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this tech stack and remove it from your portfolio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                  onClick={() => deleteTechStackMutation.mutate({ id })}
                  disabled={deleteTechStackMutation.isPending}
                >
                  {deleteTechStackMutation.isPending && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {deleteTechStackMutation.isPending
                    ? "Deleting..."
                    : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <CardContent>
        <h3 className="mb-4 font-semibold text-lg">{name}</h3>
        <div className="flex flex-wrap gap-2">
          {list.map((item, idx) => (
            <span
              key={idx.toString()}
              className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 font-medium text-primary text-sm ring-1 ring-primary/20 ring-inset"
            >
              {item}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
