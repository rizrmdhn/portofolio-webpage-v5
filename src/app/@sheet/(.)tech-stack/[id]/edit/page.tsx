import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UpdateTechStackForm from "@/components/update-tech-stack-form";
import getCurrentSession from "@/server/auth/sessions";
import { api, HydrateClient } from "@/trpc/server";
import { forbidden } from "next/navigation";

interface UpdateTechStackSheetProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdateTechStackSheet({
  params,
}: UpdateTechStackSheetProps) {
  const { id } = await params;

  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  void api.techStack.getById.prefetch({
    id,
  });

  return (
    <Sheets>
      <SheetHeader>
        <SheetTitle className="font-bold text-3xl">Edit Tech Stack</SheetTitle>
      </SheetHeader>
      <HydrateClient>
        <UpdateTechStackForm id={id} />
      </HydrateClient>
    </Sheets>
  );
}
