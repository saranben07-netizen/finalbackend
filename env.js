import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env (which is in the same folder as env.js)
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('ENV loaded'); // optional, just to verify
