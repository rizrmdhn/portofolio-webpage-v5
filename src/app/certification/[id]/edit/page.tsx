import getCurrentSession from "@/server/auth/sessions";
import { api, HydrateClient } from "@/trpc/server";
import { forbidden } from "next/navigation";
import UpdateCertificationForm from "@/components/update-certification-form";

interface UpdateCertificationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateCertificationPage({
  params,
}: UpdateCertificationPageProps) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  void api.certification.getById.prefetch({
    id,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4 xl:p-4">
      <h1 className="self-start font-bold text-3xl">Edit Certification</h1>
      <HydrateClient>
        <UpdateCertificationForm id={id} />
      </HydrateClient>
    </div>
  );
}
