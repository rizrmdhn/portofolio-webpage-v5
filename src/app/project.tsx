"use client";

import ProjectCard from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/trpc/react";
import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Project() {
	const { data: auth } = api.auth.me.useQuery();
	const { data: projects, isLoading } = api.project.getAll.useQuery();

	const router = useRouter();

	if (isLoading) {
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
	if ((!projects || projects.length === 0) && !auth) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<FolderOpen className="h-10 w-10 text-muted-foreground" />
				</div>
				<div className="mt-6 space-y-2">
					<h3 className="font-semibold text-lg">No projects found</h3>
					<p className="max-w-md text-muted-foreground text-sm">
						It looks like there are no projects to display at the moment. Check
						back later for updates!
					</p>
				</div>
				<div className="mt-6">
					<Link href="https://github.com/rizrmdhn" target="_blank">
						<Button variant="outline">
							<Plus className="mr-2 h-4 w-4" />
							View GitHub
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	const AddProjectCard = () => (
		<Card
			className="group cursor-pointer overflow-hidden border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md active:scale-95"
			onClick={() => {
				router.push("/project/create");
			}}
		>
			<CardContent className="flex h-full min-h-[200px] flex-col items-center justify-center p-4">
				<div className="flex flex-col items-center justify-center space-y-4 text-center">
					<div className="rounded-full bg-muted p-4 transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-active:scale-90">
						<Plus className="h-8 w-8" />
					</div>
					<div className="space-y-2">
						<h3 className="font-semibold text-lg transition-colors group-hover:text-primary">
							Add New Project
						</h3>
						<p className="text-muted-foreground text-sm">
							Click to create a new project
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	return (
		<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{/* Add Project Card - Only show if user is authenticated */}
			{auth && <AddProjectCard />}

			{/* Project Cards */}
			{projects?.map((proj) => (
				<ProjectCard key={proj.id} {...proj} views={proj.projectView.count} />
			))}

			{/* Empty state when authenticated user has no projects */}
			{auth && (!projects || projects.length === 0) && (
				<div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
					<div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
						<FolderOpen className="h-10 w-10 text-muted-foreground" />
					</div>
					<div className="mt-6 space-y-2">
						<h3 className="font-semibold text-lg">No projects yet</h3>
						<p className="max-w-md text-muted-foreground text-sm">
							Get started by adding your first project using the card above.
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
