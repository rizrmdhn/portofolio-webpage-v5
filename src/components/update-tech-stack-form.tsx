"use client";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import techStackSchema from "@/schema/tech-stack.schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

interface UpdateTechStackFormProps {
  id: string;
}

export default function UpdateTechStackForm({ id }: UpdateTechStackFormProps) {
  const utils = api.useUtils();
  const router = useRouter();

  const [techStack] = api.techStack.getById.useSuspenseQuery({ id });

  const { mutate, status } = api.techStack.update.useMutation({
    onSuccess: () => {
      globalSuccessToast("Tech Stack updated successfully");
      utils.techStack.getAll.invalidate();
      router.back();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to update tech stack");
    },
  });

  const form = useForm<z.infer<typeof techStackSchema.updateTechStackSchema>>({
    resolver: zodResolver(techStackSchema.updateTechStackSchema),
    defaultValues: {
      id: id,
      name: techStack?.name,
      list: techStack?.list.map((t) => t.trim()).join(", ") || "",
    },
  });

  function onSubmit(
    data: z.infer<typeof techStackSchema.updateTechStackSchema>
  ) {
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
                  <FieldLabel>Category Name</FieldLabel>
                  <Input
                    placeholder={"Type the category name"}
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
              name="list"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Technologies Used (use commas)</FieldLabel>
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
              {status === "pending" ? "Updating..." : "Update Tech Stack"}
            </Button>
          </FieldGroup>
        </form>
      </div>
    </ScrollArea>
  );
}
