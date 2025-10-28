import { api } from "@/trpc/react";

export default function useViewAs() {
	const { data, isLoading, isError } = api.viewAs.getViewAs.useQuery();

	return {
		data,
		isLoading,
		isError,
	};
}
