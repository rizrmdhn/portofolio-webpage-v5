import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import viewAsQueries from "@/server/queries/view-as.queries";
import { ViewAsViewType, type ViewAsJSONB } from "@/types/view-as.types";
import { z } from "zod";

export const viewAsRouter = createTRPCRouter({
	getViewAs: publicProcedure.query(async () => {
		const viewAsSetting = await viewAsQueries.getViewAsSetting();
		return viewAsSetting;
	}),

	setViewAs: protectedProcedure
		.input(z.object({ value: z.enum(ViewAsViewType) }))
		.mutation(async ({ input }) => {
			const sendedValue = { value: input.value } as ViewAsJSONB;

			const updatedSetting = await viewAsQueries.setViewAsSetting(sendedValue);
			return updatedSetting;
		}),
});
