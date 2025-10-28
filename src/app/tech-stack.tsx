"use client";

import TechStackCard from "@/components/tech-stack-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useViewAs from "@/hooks/use-view-as";
import { api } from "@/trpc/react";
import { ViewAsViewType } from "@/types/view-as.types";
import { Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TechStack() {
  const [auth] = api.auth.me.useSuspenseQuery();
  const [techStacks, etc] = api.techStack.getAll.useSuspenseQuery();
  const { data: viewAsSetting, isLoading: isLoadingViewAs } = useViewAs();

  const router = useRouter();

  // Determine if user should see admin features
  const isAdminView = viewAsSetting?.data?.value === ViewAsViewType.ADMIN;
  const isGuestView = viewAsSetting?.data?.value === ViewAsViewType.GUEST;

  // Show admin features if user is authenticated AND view is set to ADMIN (or no viewAs setting)
  const showAdminFeatures =
    auth && (isAdminView || (!isLoadingViewAs && !viewAsSetting));

  if (etc.isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col space-y-3">
            {/* Removed the image div because it was not needed */}
            {/* <div className="h-[200px]">
              <Skeleton className="h-full w-full rounded-xl" />
            </div> */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-4 w-[60px] rounded-full" />
              <Skeleton className="h-4 w-[60px] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state when no projects and no authenticated user
  if (
    (!techStacks || techStacks.length === 0) &&
    (isGuestView || !showAdminFeatures)
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Layers className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="mt-4 font-semibold text-lg">No Tech Stacks Found</h3>
        <p className="mt-2 text-muted-foreground text-sm">
          There are no tech stacks available at the moment.
        </p>
      </div>
    );
  }

  const AddTechStackCard = () => (
    <Card
      className="group cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md active:scale-95"
      onClick={() => {
        router.push("/tech-stack/create");
      }}
    >
      <CardContent className="flex h-full min-h-[200px] flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="rounded-full bg-muted p-4 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-active:scale-90">
            <Plus className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
              Add New Tech Stack
            </h3>
            <p className="text-muted-foreground text-sm">
              Click to create a new tech stack entry.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Add Tech Stack Card - Only show if user is authenticated */}
      {showAdminFeatures && !isGuestView && <AddTechStackCard />}
      {/* Tech Stack Cards */}
      {techStacks?.map((tech) => (
        <TechStackCard key={tech.id} {...tech} />
      ))}

      {showAdminFeatures &&
        !isGuestView &&
        (!techStacks || techStacks.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Layers className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="mt-6 space-y-2">
              <h3 className="font-semibold text-lg">No Tech Stacks yet</h3>
              <p className="max-w-md text-muted-foreground text-sm">
                Get started by adding your first tech stack using the card
                above.
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
