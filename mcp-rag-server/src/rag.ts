import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import fs from 'fs/promises';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import path from 'path';
import { getDirname } from './helpers/dirName.js';
import { extractTextFromHtml } from './helpers/extractTextFromHtml.js';
import { getEnv } from './helpers/getEnv.js';

async function* getAllHtmlFiles(dir: string): AsyncGenerator<string> {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getAllHtmlFiles(res);
    } else if (dirent.isFile() && res.endsWith('.html')) {
      yield res;
    }
  }
}

export const rag = () => {
  const { HUGGINGFACE_API_KEY } = getEnv();
  const __dirname = getDirname(import.meta.url);
  let vectorStore: MemoryVectorStore | null = null;

  const initializeVectorStore = async (): Promise<void> => {
    const docsDir = path.join(
      __dirname,
      '../../docs/SuperNovaStorybook-Mobile-Swift'
    );

    // Find all HTML files recursively
    const htmlFiles: string[] = [];
    for await (const file of getAllHtmlFiles(docsDir)) {
      htmlFiles.push(file);
    }

    // Extract text from each HTML file and collect with metadata
    const allDocs: { pageContent: string; metadata: { source: string } }[] = [];
    for (const file of htmlFiles) {
      try {
        const text = extractTextFromHtml(file);
        allDocs.push({
          pageContent: text,
          metadata: { source: path.relative(docsDir, file) },
        });
      } catch (e) {
        console.warn(`Failed to extract text from ${file}:`, e);
      }
    }

    // Split all documents into chunks (preserving metadata)
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await textSplitter.splitDocuments(allDocs);

    // Create embeddings and vector store
    const embeddings = new HuggingFaceInferenceEmbeddings({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      apiKey: HUGGINGFACE_API_KEY,
    });

    try {
      vectorStore = await MemoryVectorStore.fromDocuments(chunks, embeddings);
      console.info(
        'Vector store initialized with',
        chunks.length,
        'chunks from',
        htmlFiles.length,
        'files.'
      );
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw error;
    }
  };

  return {
    initializeVectorStore,
    getVectorStore: () => vectorStore,
  };
};
