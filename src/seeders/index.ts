import { hash } from "@node-rs/argon2";
import seedUsers from "./users";

async function seeders() {
	const hashedPassword = await hash("test12345");

	await seedUsers();
}

seeders()
	.then(() => {
		console.log("Seeding has been completed");
		process.exit(0);
	})
	.catch((err) => {
		console.error("Error while seeding:", err);
		process.exit(1);
	});
