import getCurrentSession from "@/server/auth/sessions";
import { forbidden } from "next/navigation";
import CreateCertificationForm from "@/components/create-certification-form";

export default async function CreateCertificationPage() {
  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 xl:p-4">
      <h1 className="self-start font-bold text-3xl">
        Create New Certification
      </h1>
      <CreateCertificationForm />
    </div>
  );
}
