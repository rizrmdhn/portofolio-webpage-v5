import type { Metadata } from "next";

const generateMetadata = (metadata?: Metadata) => {
	const title =
		typeof metadata?.title === "string" ? metadata.title : "Rizrmdhn";

	return {
		title: `${title} | Portofolio`,
		description:
			metadata?.description ??
			"My personal portofolio webpage built with Next.js, TypeScript, and Tailwind CSS.",
		icons: metadata?.icons ?? [{ rel: "icon", url: "/favicon.ico" }],
	};
};

export default generateMetadata;
