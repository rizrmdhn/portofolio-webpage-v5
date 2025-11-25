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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/trpc/react";
import type { Project } from "@/types/project.types";
import {
  Apple,
  Edit,
  Globe,
  ImageOff,
  LoaderCircle,
  Play,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface ProjectCardProps extends Project {
  views: number;
}

export default function ProjectCard({
  id,
  name,
  description,
  github_url,
  live_url,
  playstore_url,
  appstore_url,
  image_url,
  tech,
  views,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();

  const { data: me } = api.auth.me.useQuery();

  const incrementViewMutation = api.project.updateView.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  const deleteProjectMutation = api.project.delete.useMutation({
    onSuccess: () => {
      globalSuccessToast("Project deleted successfully");
      utils.project.getAll.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to delete project");
    },
    onSettled: () => {
      setIsOpen(false);
    },
  });

  const deleteProjectImageMutation = api.project.deleteImage.useMutation({
    onSuccess: () => {
      globalSuccessToast("Project image deleted successfully");
      utils.project.getAll.invalidate();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to delete project image");
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  return (
    <Card className="group relative overflow-hidden p-0">
      {/* Edit/Delete buttons - Only show on hover for authenticated users */}
      {me && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {image_url ? (
            <AlertDialog open={isDeleting}>
              <AlertDialogTrigger asChild>
                <Button
                  // variant="ghost"
                  size="icon"
                  className="h-8 w-8 cursor-pointer bg-red-50 text-red-600 shadow-sm hover:bg-red-100 focus:ring-2 focus:ring-red-500"
                  onClick={() => setIsDeleting(true)}
                >
                  <ImageOff className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove existing image?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove the existing image? You can
                    then upload a new one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setIsDeleting(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteProjectImageMutation.mutate({ id })}
                    className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                    disabled={deleteProjectImageMutation.isPending}
                  >
                    {deleteProjectImageMutation.isPending && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {deleteProjectImageMutation.isPending
                      ? "Removing..."
                      : "Continue"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <UploadButton
              config={{ cn: twMerge }}
              className="h-8 w-8"
              appearance={{
                button:
                  "h-8 w-8 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md border border-input shadow-sm transition-colors flex items-center justify-center",
                container: "w-8 h-8",
                allowedContent: "sr-only",
              }}
              content={{
                button: <Upload className="h-4 w-4" />,
              }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                globalSuccessToast("Image uploaded successfully");
                utils.project.getAll.invalidate();
              }}
              onUploadError={(error: Error) => {
                globalErrorToast(error.message || "Image upload failed");
              }}
              input={{ projectId: id }}
            />
          )}
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 cursor-pointer shadow-sm"
            onClick={() => router.push(`/project/${id}/edit`)}
            onMouseEnter={() => {
              utils.project.getById.prefetch({ id });
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
                disabled={deleteProjectMutation.isPending}
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
                  this project and remove it from your portfolio.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
                  onClick={() => deleteProjectMutation.mutate({ id })}
                  disabled={deleteProjectMutation.isPending}
                >
                  {deleteProjectMutation.isPending && (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {deleteProjectMutation.isPending ? "Deleting..." : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Project Image */}
      {image_url && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={image_url}
            alt={`${name} project screenshot`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <CardContent className="p-4">
        <h3 className="mb-2 font-semibold text-xl">{name}</h3>
        <p className="mb-4 text-muted-foreground text-sm">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tech.map((tech, idx) => (
            <span
              key={idx.toString()}
              className="inline-flex items-center rounded-md bg-muted px-2 py-1 font-medium text-xs ring-1 ring-gray-500/10 ring-inset"
            >
              {tech}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-row justify-between p-4 pt-0">
        <div className="flex flex-wrap items-center gap-2">
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              onClick={() => incrementViewMutation.mutate({ projectId: id })}
              rel="noreferrer"
            >
              <FaGithub className="h-4 w-4" />
              View on GitHub
            </a>
          )}
          {live_url && (
            <a
              href={live_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              onClick={() => incrementViewMutation.mutate({ projectId: id })}
            >
              <Globe className="h-4 w-4" />
              View Live
            </a>
          )}
          {playstore_url && (
            <a
              href={playstore_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              onClick={() => incrementViewMutation.mutate({ projectId: id })}
            >
              <Play className="h-4 w-4" />
              View on Play Store
            </a>
          )}
          {appstore_url && (
            <a
              href={appstore_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              onClick={() => incrementViewMutation.mutate({ projectId: id })}
            >
              <Apple className="h-4 w-4" />
              View on App Store
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm">{views} Views</p>
        </div>
      </CardFooter>
    </Card>
  );
}
