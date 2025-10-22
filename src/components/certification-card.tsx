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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { api } from "@/trpc/react";
import type { Certification } from "@/types/certification.types";
import { format } from "date-fns";
import { Edit, ExternalLink, LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CertificationCardProps extends Certification {}

export default function CertificationCard({
  id,
  name,
  issuer,
  issueDate,
  expiryDate,
  certificate_id,
  certificate_url,
}: CertificationCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();

  const { data: me } = api.auth.me.useQuery();

  const deleteCertificationMutation = api.certification.delete.useMutation({
    onSuccess: () => {
      globalSuccessToast("Certification deleted successfully");
      utils.certification.getAll.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to delete certification");
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
            onClick={() => router.push(`/certification/${id}/edit`)}
            onMouseEnter={() => {
              utils.certification.getById.prefetch({ id });
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
                disabled={deleteCertificationMutation.isPending}
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
                  this certification and remove it from your profile.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                  onClick={() => deleteCertificationMutation.mutate({ id })}
                  disabled={deleteCertificationMutation.isPending}
                >
                  {deleteCertificationMutation.isPending && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {deleteCertificationMutation.isPending
                    ? "Deleting..."
                    : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <CardHeader>
        <CardTitle className="font-bold text-xl">{name}</CardTitle>
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">
            Issued by {issuer} | {format(new Date(issueDate), "MMM yyyy")}
            {expiryDate &&
              ` - Expires ${format(new Date(expiryDate), "MMM yyyy")}`}
          </p>
          {certificate_id && (
            <p className="text-muted-foreground text-xs">
              Credential ID: {certificate_id}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificate_url && (
          <a
            href={certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary text-sm hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            View Credential
          </a>
        )}
      </CardContent>
    </Card>
  );
}
