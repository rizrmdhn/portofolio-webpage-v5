import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Experience } from "@/types/experience.types";
import {
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";
import { useRouter } from "next/navigation";
import { Edit, Trash2, LoaderCircle } from "lucide-react";
import { globalSuccessToast, globalErrorToast } from "@/lib/toast";
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
import { useState } from "react";

interface ExperienceCardProps extends Experience {}

function formatDuration(
  startDate: string,
  endDate?: string,
  currentlyWorking?: boolean
) {
  const start = new Date(startDate);
  const end = currentlyWorking ? new Date() : new Date(endDate || "");

  const days = differenceInDays(end, start);
  const weeks = differenceInWeeks(end, start);
  const months = differenceInMonths(end, start);
  const years = differenceInYears(end, start);

  if (years > 0) {
    return `${years} ${years === 1 ? "year" : "years"}`;
  }
  if (months > 0) {
    return `${months} ${months === 1 ? "month" : "months"}`;
  }
  if (weeks > 0) {
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;
  }
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export default function ExperienceCard({
  id,
  title,
  company,
  description,
  startDate,
  endDate,
  currentlyWorking,
  type,
}: ExperienceCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();

  const { data: me } = api.auth.me.useQuery();

  const deleteExperienceMutation = api.experience.delete.useMutation({
    onSuccess: () => {
      globalSuccessToast("Experience deleted successfully");
      utils.experience.getAll.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to delete experience");
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  return (
    <Card className="group relative overflow-hidden">
      {/* Edit/Delete buttons - Only show on hover for authenticated users */}
      {me && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-sm hover:cursor-pointer"
            onClick={() => router.push(`/experience/${id}/edit`)}
            onMouseEnter={() => {
              utils.experience.getById.prefetch({ id });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 shadow-sm hover:cursor-pointer"
                disabled={deleteExperienceMutation.isPending}
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
                  this experience and remove it from your profile.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                  onClick={() => deleteExperienceMutation.mutate({ id })}
                  disabled={deleteExperienceMutation.isPending}
                >
                  {deleteExperienceMutation.isPending && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {deleteExperienceMutation.isPending
                    ? "Deleting..."
                    : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <CardHeader>
        <CardTitle className="font-bold text-xl">{title}</CardTitle>
        <p className="text-muted-foreground text-sm">
          {company} | {type} | {startDate} -{" "}
          {currentlyWorking ? "Present" : endDate} (
          {formatDuration(startDate, endDate || "", currentlyWorking)})
        </p>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
