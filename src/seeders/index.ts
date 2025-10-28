import seedUsers from "./users";
import seedApplicationSettings from "./application-settings";

async function seeders() {
	await seedUsers();
	await seedApplicationSettings();
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
