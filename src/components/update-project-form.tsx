"use client";

import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import projectSchema from "@/schema/project.schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type z from "zod";
import { ScrollArea } from "./ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

interface UpdateProjectFormProps {
  id: string;
}

export default function UpdateProjectForm({ id }: UpdateProjectFormProps) {
  const utils = api.useUtils();
  const router = useRouter();

  const { data: project } = api.project.getById.useQuery({ id });

  const { mutate, status } = api.project.update.useMutation({
    onSuccess: () => {
      globalSuccessToast("Project updated successfully");
      utils.project.getAll.invalidate();
      utils.project.getById.invalidate({ id });
      router.back();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to update project");
    },
  });

  const form = useForm<z.infer<typeof projectSchema.updateProjectSchema>>({
    resolver: zodResolver(projectSchema.updateProjectSchema),
    defaultValues: {
      id: id,
      name: project?.name || "",
      description: project?.description || "",
      github_url: project?.github_url || "",
      live_url: project?.live_url || "",
      tech: project?.tech.map((t) => t.trim()).join(", ") || "",
    },
  });

  function onSubmit(data: z.infer<typeof projectSchema.updateProjectSchema>) {
    mutate(data);
  }

  return (
    <ScrollArea className="flex w-full flex-col items-center justify-center overflow-y-auto">
      <div className="flex flex-col items-center justify-center p-0 pt-4 pb-4 lg:p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder={"Type the project name"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"Type the project description"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="github_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"GitHub repository URL (optional)"}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="live_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={"Live project URL (optional)"}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tech"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technologies Used</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={"Type the technologies used (use commas)"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {status === "pending" ? "Updating..." : "Update Project"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
