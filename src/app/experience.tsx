"use client";

import ExperienceCard from "@/components/experience-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Experience() {
  const { data: auth } = api.auth.me.useQuery();
  const { data: experiences, isLoading } = api.experience.getAll.useQuery();

  const router = useRouter();

  if (isLoading) {
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

  // Empty state when no experiences and no authenticated user
  if ((!experiences || experiences.length === 0) && !auth) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="mt-6 space-y-2">
          <h3 className="text-lg font-semibold">No experience found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            It looks like there are no work experiences to display at the
            moment. Check back later for updates!
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

  const AddExperienceCard = () => (
    <Card
      className="overflow-hidden border-dashed border-2 hover:border-solid transition-all duration-200 cursor-pointer group active:scale-95 hover:shadow-md"
      onClick={() => {
        router.push("/experience/create");
      }}
    >
      <CardContent className="p-4 h-full flex flex-col items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-4 group-hover:bg-primary group-hover:text-primary-foreground group-active:scale-90 transition-all duration-200">
            <Plus className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              Add New Experience
            </h3>
            <p className="text-sm text-muted-foreground">
              Click to add a work experience
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Add Experience Card - Only show if user is authenticated */}
      {auth && <AddExperienceCard />}

      {/* Experience Cards */}
      {experiences?.map((exp) => (
        <ExperienceCard key={exp.id} {...exp} />
      ))}

      {/* Empty state when authenticated user has no experiences */}
      {auth && (!experiences || experiences.length === 0) && (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold">No experiences yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Get started by adding your first work experience using the card
              above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
