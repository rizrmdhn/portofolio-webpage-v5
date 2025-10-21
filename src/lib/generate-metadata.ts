import type { Metadata } from "next";

const generateMetadata = (metadata?: Metadata) => {
	const title =
		typeof metadata?.title === "string" ? metadata.title : "Portofolio Webpage";

	return {
		title: `${title} | Portofolio Webpage`,
		description:
			metadata?.description ??
			"My personal portofolio webpage built with Next.js, TypeScript, and Tailwind CSS.",
		icons: metadata?.icons ?? [{ rel: "icon", url: "/favicon.ico" }],
	};
};

export default generateMetadata;
