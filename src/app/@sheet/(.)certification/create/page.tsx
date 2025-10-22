import Sheets from "@/components/sheets";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import getCurrentSession from "@/server/auth/sessions";
import { forbidden } from "next/navigation";
import CreateCertificationForm from "@/components/create-certification-form";

export default async function CreateNewCertificationSheet() {
  const { user } = await getCurrentSession();

  if (!user) {
    forbidden();
  }

  return (
    <Sheets>
      <SheetHeader>
        <SheetTitle className="font-bold text-3xl">
          Create New Certification
        </SheetTitle>
      </SheetHeader>
      <CreateCertificationForm />
    </Sheets>
  );
}
