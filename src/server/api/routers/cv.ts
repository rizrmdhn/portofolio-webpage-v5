import cvQueries from "@/server/queries/cv.queries";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const cvRouter = createTRPCRouter({
	getCV: publicProcedure.query(async () => {
		return await cvQueries.getCVSetting();
	}),
});
