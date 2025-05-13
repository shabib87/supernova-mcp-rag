import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { rag } from './rag.js';
import type { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const mcp = () => {
  const server = new McpServer({
    name: 'Supernova MCP RAG Server',
    version: '1.0.0',
  });

  const {
    initializeVectorStore,
    getVectorStore,
  }: {
    initializeVectorStore: () => Promise<void>;
    getVectorStore: () => MemoryVectorStore | null;
  } = rag();

  server.tool(
    'search_docs',
    {
      query: z.string(),
      k: z.number().optional().default(3),
    },
    async ({ query, k }) => {
      const vectorStore = getVectorStore();
      if (!vectorStore) throw new Error('Vector store not initialized');
      const results = await vectorStore.similaritySearch(query, k ?? 3);
      return {
        content: results.map(r => ({
          type: 'text',
          text: r.pageContent,
          source: r.metadata.source,
        })),
      };
    }
  );

  async function main() {
    await initializeVectorStore();
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }

  return {
    main,
  };
};
