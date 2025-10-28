import CreateTechStackForm from "@/components/create-tech-stack-form";
import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import getCurrentSession from "@/server/auth/sessions";
import { forbidden } from "next/navigation";

export default async function CreateNewTechStackSheet() {
  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  return (
    <Sheets>
      <SheetHeader>
        <SheetTitle className="font-bold text-3xl">
          Create New Tech Stack
        </SheetTitle>
      </SheetHeader>
      <CreateTechStackForm />
    </Sheets>
  );
}
