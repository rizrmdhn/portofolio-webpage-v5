import CreateProjectForm from "@/components/create-project-form";
import getCurrentSession from "@/server/auth/sessions";
import { forbidden } from "next/navigation";

export default async function CreateProjectPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 xl:p-4">
      <h1 className="self-start font-bold text-3xl">Create New Project</h1>
      <CreateProjectForm />
    </div>
  );
}
