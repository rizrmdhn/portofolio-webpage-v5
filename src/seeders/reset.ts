// path to a file with schema you want to reset
import { db } from "@/server/db/index.js";
import * as schema from "@/server/db/schema";
import { reset } from "drizzle-seed";

async function main() {
	await reset(db, schema);
}

main()
	.then(() => {
		console.log("Database reset successfully");
		process.exit(0);
	})
	.catch((error) => {
		console.error("Error resetting database:", error);
		process.exit(1);
	});
