import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const viewsDir = 'views';

export const appNames = ['app', 'hzv'] as const;