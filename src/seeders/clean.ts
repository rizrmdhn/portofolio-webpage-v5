import { db } from "@/server/db";
import { sql } from "drizzle-orm";

export async function cleanAllTables() {
	try {
		// Get and clean all tables in the current schema

		const query = sql`
		-- Delete all tables
		DO $$ DECLARE
		    r RECORD;
		BEGIN
		    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
		        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
		    END LOOP;
		END $$;
		
		-- Delete enums
		DO $$ DECLARE
			r RECORD;
		BEGIN
			FOR r IN (select t.typname as enum_name
			from pg_type t 
				join pg_enum e on t.oid = e.enumtypid  
				join pg_catalog.pg_namespace n ON n.oid = t.typnamespace
			where n.nspname = current_schema()) LOOP
				EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.enum_name);
			END LOOP;
		END $$;
		
		`;

		await db.execute(query);
		console.log("Successfully cleaned all tables");

		return true;
	} catch (error) {
		console.error("Error cleaning tables:", error);
		throw error;
	}
}

cleanAllTables()
	.then(() => {
		console.log("All tables cleaned successfully");
	})
	.catch((error) => {
		console.error("Failed to clean tables:", error);
	})
	.finally(() => {
		process.exit(0);
	});
