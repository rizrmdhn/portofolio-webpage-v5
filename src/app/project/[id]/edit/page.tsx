import UpdateProjectForm from "@/components/update-project-form";
import getCurrentSession from "@/server/auth/sessions";
import { api } from "@/trpc/server";
import { forbidden } from "next/navigation";

interface UpdateProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateProjectPage({
  params,
}: UpdateProjectPageProps) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  void api.project.getById.prefetch({
    id,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 xl:p-4">
      <h1 className="self-start font-bold text-3xl">Edit Project</h1>
      <UpdateProjectForm id={id} />
    </div>
  );
}
