import path from 'path';
import dotenv from 'dotenv';
import { getDirname } from './dirName.js';

type Env = {
  HUGGINGFACE_API_KEY: string;
  PORT: string;
};

export const getEnv = () => {
  // Load environment variables from root .env file
  const __dirname = getDirname(import.meta.url);
  const rootPath = path.join(__dirname, '../../../.env');
  console.info('rootPath: ', rootPath);
  const result = dotenv.config({ path: rootPath });
  if (result.error) {
    throw new Error('Error loading .env file');
  }

  return {
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    PORT: process.env.PORT,
  };
};
