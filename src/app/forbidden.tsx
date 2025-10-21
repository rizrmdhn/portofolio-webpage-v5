"use client";

import { useRouter } from "next/navigation";

export default function ForbiddenComponent() {
	const router = useRouter();

	return (
		<div className="flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 text-center">
			<div className="max-w-md space-y-4">
				<h1 className="font-bold text-9xl text-gray-900 dark:text-gray-50">
					403
				</h1>
				<h2 className="font-semibold text-3xl text-gray-900 dark:text-gray-50">
					Oops! You do not have permission to access this page.
				</h2>
				<p className="text-gray-500 dark:text-gray-400">
					You do not have permission to access this resource.
				</p>
				<a
					className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 font-medium text-gray-50 text-sm shadow transition-colors hover:cursor-pointer hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:focus-visible:ring-gray-300 dark:hover:bg-gray-50/90"
					// biome-ignore lint/a11y/useValidAnchor: <explanation>
					onClick={() => {
						router.back();
					}}
				>
					Go to previous page
				</a>
			</div>
		</div>
	);
}
