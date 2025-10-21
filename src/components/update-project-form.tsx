"use client";

import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import projectSchema from "@/schema/project.schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { ScrollArea } from "./ui/scroll-area";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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

  const [project] = api.project.getById.useSuspenseQuery({ id });

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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Project Name</FieldLabel>
                  <Input
                    placeholder={"Type the project name"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Project Description</FieldLabel>
                  <Textarea
                    placeholder={"Type the project description"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="github_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>GitHub URL</FieldLabel>
                  <Input
                    placeholder={"GitHub repository URL (optional)"}
                    {...field}
                    value={field.value || ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="live_url"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Live URL</FieldLabel>
                  <Input
                    placeholder={"Live project URL (optional)"}
                    {...field}
                    value={field.value || ""}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="tech"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Technologies Used</FieldLabel>
                  <Textarea
                    placeholder={"Type the technologies used (use commas)"}
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" disabled={status === "pending"}>
              {status === "pending" ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {status === "pending" ? "Updating..." : "Update Project"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </ScrollArea>
  );
}
