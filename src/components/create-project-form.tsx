"use client";

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import projectSchema from "@/schema/project.schema";
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
							{status === "pending" ? "Creating..." : "Create Project"}
						</Button>
					</FieldGroup>
				</form>
			</div>
		</ScrollArea>
	);
}
