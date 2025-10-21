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

export default function CreateProjectForm() {
  const utils = api.useUtils();
  const router = useRouter();

  const { mutate, status } = api.project.create.useMutation({
    onSuccess: () => {
      globalSuccessToast("Project created successfully");
      utils.project.getAll.invalidate();
      router.back();
    },
    onError: (error) => {
      globalErrorToast(error.message || "Failed to create project");
    },
  });

  const form = useForm<z.infer<typeof projectSchema.createProjectSchema>>({
    resolver: zodResolver(projectSchema.createProjectSchema),
    defaultValues: {
      github_url: "",
      live_url: "",
      tech: "",
    },
  });

  function onSubmit(data: z.infer<typeof projectSchema.createProjectSchema>) {
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
              {status === "pending" ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}
