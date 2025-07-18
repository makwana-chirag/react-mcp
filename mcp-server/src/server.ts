import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs/promises";

// Server
const server = new McpServer({
  name: "MCP Server",
  version: "1.0.0",
  //   title: "MCP Server",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

// Tools
server.tool(
  "create-product",
  "create a new product for the store",
  {
    name: z.string(),
    price: z.number(),
    description: z.string(),
    category: z.string(),
    stock: z.number(),
  },
  {
    title: "Create Product",
    destructiveHint: false,
    idempotentHint: false,
    readOnlyHint: false,
    openWorldHint: true,
  },
  async (args) => {
    try {
      const id = await createProduct(args);
      return {
        content: [
          {
            type: "text",
            text: `Product ${args.name} (ID: ${id}) has been added successfully`,
          },
        ],
      };
    } catch {
      return {
        content: [{ type: "text", text: "Failed to add product" }],
      };
    }
  }
);

// Creating User
const createProduct = async (args: {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}) => {
  const product = await import("./data/product.json", {
    with: { type: "json" },
  }).then((m) => m.default);

  const id = product.length + 1;
  product.push({
    id: id.toString(),
    ...args,
  });

  await fs.writeFile("./src/data/product.json", JSON.stringify(product));

  return id;
};

// Main
async function main() {
  console.log("MCP Server running on http://localhost:5000");
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
