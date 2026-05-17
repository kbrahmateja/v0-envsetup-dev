import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs-extra";
import path from "path";

class EnvSetupMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "envsetup-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_project_status",
          description: "Analyze the current directory to see if it's managed by envsetup",
          inputSchema: {
            type: "object",
            properties: {
              path: { type: "string", description: "Absolute path to the project" },
            },
          },
        },
        {
          name: "propose_environment_fix",
          description: "Given an error, suggest which envsetup tool or config to update",
          inputSchema: {
            type: "object",
            properties: {
              errorMessage: { type: "string" },
            },
            required: ["errorMessage"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case "get_project_status": {
          const projectPath = (request.params.arguments?.path as string) || process.cwd();
          const hasEnvSetup = await fs.pathExists(path.join(projectPath, "docker-compose.yml"));
          
          return {
            content: [
              {
                type: "text",
                text: hasEnvSetup 
                  ? "This project is managed by envsetup (Found docker-compose.yml)." 
                  : "No envsetup configuration found in this directory.",
              },
            ],
          };
        }
        
        case "propose_environment_fix": {
          const error = request.params.arguments?.errorMessage as string;
          let suggestion = "Try running 'envsetup doctor' to check common issues.";
          
          if (error.includes("docker")) suggestion = "Docker seems to be the issue. Ensure the Docker daemon is running.";
          if (error.includes("port 3000")) suggestion = "Port 3000 is occupied. Change the mapping in docker-compose.yml.";

          return {
            content: [{ type: "text", text: suggestion }],
          };
        }

        default:
          throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("EnvSetup MCP server running on stdio");
  }
}

const server = new EnvSetupMcpServer();
server.run().catch(console.error);
