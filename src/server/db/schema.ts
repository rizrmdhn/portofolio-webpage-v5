// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
	(name) => `portofolio-webpage-v5_${name}`,
);

export const users = createTable(
	"users",
	(d) => ({
		id: d
			.uuid()
			.primaryKey()
			.$default(() => uuidv7()),
		name: d.varchar({ length: 256 }).notNull(),
		email: d.varchar({ length: 256 }).notNull(),
		password: d.varchar({ length: 256 }).notNull(),
		createdAt: d
			.timestamp({ withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
	}),
	(t) => [index("users_id_idx").on(t.id), index("users_email_idx").on(t.email)],
);

export const sessions = createTable(
	"sessions",
	(d) => ({
		id: d
			.uuid()
			.primaryKey()
			.$default(() => uuidv7()),
		userId: d
			.uuid()
			.references(() => users.id, {
				onDelete: "cascade",
			})
			.notNull(),
		expiresAt: d
			.timestamp("expires_at", { withTimezone: true, mode: "string" })
			.notNull(),
		createdAt: d
			.timestamp({ withTimezone: true, mode: "string" })
			.defaultNow()
			.notNull(),
	}),
	(t) => {
		return [
			index("session_id_idx").on(t.id),
			index("user_id_idx").on(t.userId),
		];
	},
);
