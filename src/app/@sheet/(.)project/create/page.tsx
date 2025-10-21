import CreateProjectForm from "@/components/create-project-form";
import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import getCurrentSession from "@/server/auth/sessions";
import { forbidden } from "next/navigation";

export default async function CreateNewProjectSheet() {
	const { user } = await getCurrentSession();

	if (!user) {
		forbidden();
	}

	return (
		<Sheets>
			<SheetHeader>
				<SheetTitle className="font-bold text-3xl">
					Create New Project
				</SheetTitle>
			</SheetHeader>
			<CreateProjectForm />
		</Sheets>
	);
}
