import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import type { Project } from "@/types/project.types";
import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

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
  const utils = api.useUtils();
  const incrementViewMutation = api.project.updateView.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  return (
    <Card className="overflow-hidden">
      {/* Removed image div because it was not needed */}
      {/* <div className="relative aspect-video">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
      </div> */}
      <CardContent className="p-4">
        <h3 className="mb-2 text-xl font-semibold">{name}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tech.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
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
