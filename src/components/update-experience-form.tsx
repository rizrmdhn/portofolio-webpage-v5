"use client";

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "@/components/ui/field";
import { EXPERIENCE_TYPES } from "@/lib/constants";
import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import experienceSchema from "@/schema/experience.schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface UpdateExperienceFormProps {
	id: string;
}

export default function UpdateExperienceForm({
	id,
}: UpdateExperienceFormProps) {
	const utils = api.useUtils();
	const router = useRouter();

	const [experience] = api.experience.getById.useSuspenseQuery({ id });

	const { mutate, status } = api.experience.update.useMutation({
		onSuccess: () => {
			globalSuccessToast("Experience updated successfully");
			utils.experience.getAll.invalidate();
			router.back();
		},
		onError: (error) => {
			globalErrorToast(error.message || "Failed to update experience");
		},
	});

	const form = useForm<z.infer<typeof experienceSchema.updateExperienceSchema>>(
		{
			resolver: zodResolver(experienceSchema.updateExperienceSchema),
			defaultValues: {
				id: id,
				title: experience?.title || "",
				company: experience?.company || "",
				description: experience?.description || "",
				startDate: experience?.startDate || "",
				endDate: experience?.endDate || "",
				currentlyWorking: experience?.currentlyWorking || false,
				type: experience?.type || "freelance",
			},
		},
	);

	function onSubmit(
		data: z.infer<typeof experienceSchema.updateExperienceSchema>,
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
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Experience Title</FieldLabel>
									<Input
										placeholder={"Type the experience title"}
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
							name="company"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Company</FieldLabel>
									<Input
										placeholder={"Type the company name"}
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
									/>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="startDate"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="flex flex-col"
								>
									<FieldLabel>Start Date</FieldLabel>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.value ? new Date(field.value) : undefined
												}
												onSelect={(date) => field.onChange(date?.toISOString())}
												disabled={(date) =>
													date > new Date() || date < new Date("1900-01-01")
												}
												captionLayout="dropdown"
											/>
										</PopoverContent>
									</Popover>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="endDate"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field
									data-invalid={fieldState.invalid}
									className="flex flex-col"
								>
									<FieldLabel>End Date</FieldLabel>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pick a date</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={
													field.value ? new Date(field.value) : undefined
												}
												onSelect={(date) => field.onChange(date?.toISOString())}
												disabled={(date) =>
													date > new Date() || date < new Date("1900-01-01")
												}
												captionLayout="dropdown"
											/>
										</PopoverContent>
									</Popover>

									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="type"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Experience Type</FieldLabel>
									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
									>
										<SelectTrigger
											id="form-rhf-select-language"
											// aria-invalid={fieldState.invalid}
											className="w-full"
										>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent position="item-aligned">
											{EXPERIENCE_TYPES.map((exp, idx) => (
												<SelectItem key={idx.toString()} value={exp}>
													{exp}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="currentlyWorking"
							control={form.control}
							render={({ field, fieldState }) => (
								<FieldSet
									data-invalid={fieldState.invalid}
									className="flex flex-row items-center space-x-3 space-y-0"
								>
									<FieldGroup data-slot="checkbox-group">
										<Field orientation="horizontal">
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
											<FieldLabel>Currently Working</FieldLabel>

											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									</FieldGroup>
								</FieldSet>
							)}
						/>

						<Button type="submit" disabled={status === "pending"}>
							{status === "pending" ? (
								<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
							) : null}
							{status === "pending" ? "Updating..." : "Update Experience"}
						</Button>
					</FieldGroup>
				</form>
			</div>
		</ScrollArea>
	);
}
