import CVViewer from "@/components/cv-viewer";
import { Button } from "@/components/ui/button";
import generateMetadata from "@/lib/generate-metadata";
import { HydrateClient, api } from "@/trpc/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Resume",
  description: "View and download my latest resume.",
});

export default async function ResumePage() {
  api.cv.getCV.prefetch();
  api.auth.me.prefetch();
  api.viewAs.getViewAs.prefetch();

  return (
    <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:px-6">
      <div className="flex items-center justify-between gap-2 border-b pb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
        My Resume
      </h1>
      <p className="text-muted-foreground text-sm md:text-base">
        View the latest resume online or download the dedicated file.
      </p>
      <HydrateClient>
        <CVViewer />
      </HydrateClient>
    </div>
  );
}
