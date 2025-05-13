import path from 'path';
import { fileURLToPath } from 'url';

export const getDirname = (metaUrl: string) => {
  return path.dirname(fileURLToPath(metaUrl));
};
