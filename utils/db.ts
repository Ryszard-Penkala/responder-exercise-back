import { createPool } from 'mysql2/promise';
import { config } from '../config/config';

export const pool = createPool({
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpassword,
  database: config.dbdatabase,
  namedPlaceholders: true,
  decimalNumbers: true,
});