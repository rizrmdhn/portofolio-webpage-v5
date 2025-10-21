import CreateExperienceForm from "@/components/create-experience-form";
import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UpdateExperienceForm from "@/components/update-experience-form";
import getCurrentSession from "@/server/auth/sessions";
import { api } from "@/trpc/server";
import { forbidden } from "next/navigation";

interface UpdateExperienceSheetProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function UpdateExperienceSheet({
	params,
}: UpdateExperienceSheetProps) {
	const { id } = await params;

	const { user } = await getCurrentSession();

	if (!user) {
		forbidden();
	}

	api.experience.getById.prefetch({ id });

	return (
		<Sheets>
			<SheetHeader>
				<SheetTitle className="font-bold text-3xl">
					Update Experience
				</SheetTitle>
			</SheetHeader>
			<UpdateExperienceForm id={id} />
		</Sheets>
	);
}
