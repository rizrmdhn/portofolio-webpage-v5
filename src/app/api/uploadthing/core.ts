import { env } from "@/env";
import getCurrentSession from "@/server/auth/sessions";
import projectQueries from "@/server/queries/project.queries";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import z from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	imageUploader: f({
		image: {
			/**
			 * For full list of options and defaults, see the File Route API reference
			 * @see https://docs.uploadthing.com/file-routes#route-config
			 */
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.input(
			z.object({
				projectId: z.string().min(1),
			}),
		)
		// Set permissions and file types for this FileRoute
		.middleware(async ({ input }) => {
			// This code runs on your server before upload
			const { user } = await getCurrentSession();

			// If you throw, the user will not be able to upload
			if (!user) throw new UploadThingError("Unauthorized");

			// Throw error if user email not same as allowed email
			if (user.email !== env.ALLOWED_EMAIL_LOGIN)
				throw new UploadThingError("Unauthorized");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id, projectId: input.projectId };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			await projectQueries.insertImageToProject(
				metadata.projectId,
				file.ufsUrl,
			);

			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
