import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";
import { certificationRouter } from "./routers/certification";
import { experienceRouter } from "./routers/experience";
import { projectRouter } from "./routers/project";
import { viewAsRouter } from "./routers/view-as";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	auth: authRouter,
	project: projectRouter,
	experience: experienceRouter,
	certification: certificationRouter,
	viewAs: viewAsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
