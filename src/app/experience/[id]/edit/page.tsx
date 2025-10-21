import UpdateExperienceForm from "@/components/update-experience-form";
import getCurrentSession from "@/server/auth/sessions";
import { api } from "@/trpc/server";
import { forbidden } from "next/navigation";

interface UpdateExperiencePageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function UpdateExperiencePage({
	params,
}: UpdateExperiencePageProps) {
	const { id } = await params;

	const { user } = await getCurrentSession();

	if (!user) {
		forbidden();
	}

	api.experience.getById.prefetch({ id });

	return (
		<div className="flex flex-col items-center justify-center gap-4 xl:p-4">
			<h1 className="self-start font-bold text-3xl">Update Experience</h1>
			<UpdateExperienceForm id={id} />
		</div>
	);
}
