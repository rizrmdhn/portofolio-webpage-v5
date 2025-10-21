import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import type { Project } from "@/types/project.types";
import { Globe, Edit, Trash2, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";
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

interface ProjectCardProps extends Project {
  views: number;
}

export default function ProjectCard({
  id,
  name,
  description,
  github_url,
  live_url,
  tech,
  views,
}: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Card className="group relative overflow-hidden">
      {/* Edit/Delete buttons - Only show on hover for authenticated users */}
      {me && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-sm hover:cursor-pointer"
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
                className="h-8 w-8 shadow-sm hover:cursor-pointer"
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
                  your account and remove your data from our servers.
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
        <div className="flex items-center gap-2">
          {github_url && (
            <Link
              href={github_url}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              onClick={() => incrementViewMutation.mutate({ projectId: id })}
            >
              <FaGithub className="h-4 w-4" />
              View on GitHub
            </Link>
          )}
          {live_url && (
            <Link
              href={live_url}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm hover:underline"
              onClick={() => incrementViewMutation.mutate({ projectId: id })}
            >
              <Globe className="h-4 w-4" />
              View Live
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm">{views} Views</p>
        </div>
      </CardFooter>
    </Card>
  );
}
