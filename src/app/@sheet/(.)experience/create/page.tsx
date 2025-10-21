import CreateExperienceForm from "@/components/create-experience-form";
import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import getCurrentSession from "@/server/auth/sessions";
import { forbidden } from "next/navigation";

export default async function CreateNewExperienceSheet() {
  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  return (
    <Sheets>
      <SheetHeader>
        <SheetTitle className="font-bold text-3xl">
          Create New Experience
        </SheetTitle>
      </SheetHeader>
      <CreateExperienceForm />
    </Sheets>
  );
}
