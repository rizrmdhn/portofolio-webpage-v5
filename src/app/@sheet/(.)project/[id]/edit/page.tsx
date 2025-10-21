import CreateProjectForm from "@/components/create-project-form";
import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UpdateProjectForm from "@/components/update-project-form";
import getCurrentSession from "@/server/auth/sessions";
import { api } from "@/trpc/server";
import { forbidden } from "next/navigation";

interface UpdateProjectSheetProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateProjectSheet({
  params,
}: UpdateProjectSheetProps) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  void api.project.getById.prefetch({
    id,
  });

  return (
    <Sheets>
      <SheetHeader>
        <SheetTitle className="font-bold text-3xl">Edit Project</SheetTitle>
      </SheetHeader>
      <UpdateProjectForm id={id} />
    </Sheets>
  );
}
