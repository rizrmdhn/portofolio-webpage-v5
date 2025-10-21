"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { globalErrorToast, globalSuccessToast } from "@/lib/toast";
import authSchema from "@/schema/auth.schema";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
	const utils = api.useUtils();
	const router = useRouter();
	const [type, setType] = useState<"text" | "password">("password");

	const loginMutation = api.auth.login.useMutation({
		onSuccess: () => {
			utils.auth.me.invalidate();
			globalSuccessToast("Logged in successfully");
			router.push("/");
		},
		onError: (error) => {
			globalErrorToast(error.message);
		},
	});

	const form = useForm<z.infer<typeof authSchema.loginSchema>>({
		resolver: zodResolver(authSchema.loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function handleSubmit(data: z.infer<typeof authSchema.loginSchema>) {
		loginMutation.mutate(data);
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4">
			<Card className="w-full sm:w-[350px] md:w-[450px]">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
					<CardDescription className="text-sm">
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="grid gap-4"
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="ml-1 font-bold text-sm">
											Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="Enter your email"
												className="h-10 text-sm"
												{...field}
											/>
										</FormControl>
										<FormMessage className="min-h-[16px] text-xs" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel className="ml-1 font-bold text-sm">
											Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													placeholder="Enter your password"
													type={type}
													className="h-10 pr-10 text-sm"
													{...field}
												/>
												<Button
													type="button"
													variant="ghost"
													size="sm"
													className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
													onClick={() => {
														setType((prev) =>
															prev === "password" ? "text" : "password",
														);
													}}
												>
													{type === "password" ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
											</div>
										</FormControl>
										<FormMessage className="min-h-[16px] text-xs" />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="mt-2 h-10 w-full text-sm"
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? (
									<LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
								) : null}
								Login
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
