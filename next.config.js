/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "fcxfu9avef.ufs.sh",
				pathname: "/f/*",
			},
		],
	},
	experimental: {
		authInterrupts: true,
		reactCompiler: true,
	},
	typedRoutes: true,
	output: "standalone",
};

export default config;
