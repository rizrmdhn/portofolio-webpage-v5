import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import getCurrentSession from "@/server/auth/sessions";
import { api, HydrateClient } from "@/trpc/server";
import { forbidden } from "next/navigation";
import UpdateCertificationForm from "@/components/update-certification-form";

interface UpdateCertificationSheetProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateCertificationSheet({
  params,
}: UpdateCertificationSheetProps) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  api.certification.getById.prefetch({ id });

  return (
    <Sheets>
      <SheetHeader>
        <SheetTitle className="font-bold text-3xl">
          Update Certification
        </SheetTitle>
      </SheetHeader>
      <HydrateClient>
        <UpdateCertificationForm id={id} />
      </HydrateClient>
    </Sheets>
  );
}
