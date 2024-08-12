import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const buildings = sqliteTable('buildings', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  builtYear: integer('built_year').notNull(),
});
