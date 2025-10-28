import UpdateTechStackForm from "@/components/update-tech-stack-form";
import getCurrentSession from "@/server/auth/sessions";
import { api, HydrateClient } from "@/trpc/server";
import { forbidden } from "next/navigation";

interface UpdateTechStackPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateTechStackPage({
  params,
}: UpdateTechStackPageProps) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  void api.techStack.getById.prefetch({
    id,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 xl:p-4">
      <h1 className="self-start font-bold text-3xl">Edit Tech Stack</h1>
      <HydrateClient>
        <UpdateTechStackForm id={id} />
      </HydrateClient>
    </div>
  );
}
