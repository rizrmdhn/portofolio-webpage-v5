import { Card } from "@/components/ui/card";

const technologies = [
	{
		category: "Frontend",
		skills: [
			"React",
			"Next.js",
			"TypeScript",
			"TailwindCSS",
			"Redux",
			"Zustand",
			"Shadcn",
		],
	},
	{
		category: "Backend",
		skills: ["Node.js", "Express", "Laravel", "PostgreSQL"],
	},
	{
		category: "Tools",
		skills: ["VS Code", "Postman", "Figma", "Vitest", "GitHub", "Coolify"],
	},
];

export default function TechStack() {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{technologies.map((tech) => (
				<Card key={tech.category} className="p-6">
					<h3 className="mb-4 font-semibold text-lg">{tech.category}</h3>
					<div className="flex flex-wrap gap-2">
						{tech.skills.map((skill) => (
							<span
								key={skill}
								className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 font-medium text-primary text-sm ring-1 ring-primary/20 ring-inset"
							>
								{skill}
							</span>
						))}
					</div>
				</Card>
			))}
		</div>
	);
}
