import { drizzle } from 'drizzle-orm/d1';

import * as schema from './schema';

export const getDBClient = (d1Database: D1Database) => {
  return drizzle(d1Database, { schema });
};

export * as schema from './schema';
