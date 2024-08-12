import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('buildings', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  builtYear: integer('built_year').notNull(),
});
