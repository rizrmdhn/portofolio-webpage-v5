"use client";

import CertificationCard from "@/components/certification-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { Award, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Certification() {
  const [auth] = api.auth.me.useSuspenseQuery();
  const [certifications, etc] = api.certification.getAll.useSuspenseQuery();

  const router = useRouter();

  if (etc.isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state when no certifications and no authenticated user
  if ((!certifications || certifications.length === 0) && !auth) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Award className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="mt-6 space-y-2">
          <h3 className="font-semibold text-lg">No certifications found</h3>
          <p className="max-w-md text-muted-foreground text-sm">
            It looks like there are no certifications to display at the moment.
            Check back later for updates!
          </p>
        </div>
        <div className="mt-6">
          <Link href="https://www.linkedin.com/in/rizrmdhn/" target="_blank">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              View LinkedIn
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const AddCertificationCard = () => (
    <Card
      className="group cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md active:scale-95"
      onClick={() => {
        router.push("/certification/create");
      }}
    >
      <CardContent className="flex h-full min-h-[200px] flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-4 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-active:scale-90">
            <Plus className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
              Add New Certification
            </h3>
            <p className="text-muted-foreground text-sm">
              Click to add a certification
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Add Certification Card - Only show if user is authenticated */}
      {auth && <AddCertificationCard />}

      {/* Certification Cards */}
      {certifications?.map((cert) => (
        <CertificationCard key={cert.id} {...cert} />
      ))}

      {/* Empty state when authenticated user has no certifications */}
      {auth && (!certifications || certifications.length === 0) && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Award className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="font-semibold text-lg">No certifications yet</h3>
            <p className="max-w-md text-muted-foreground text-sm">
              Get started by adding your first certification using the card
              above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
