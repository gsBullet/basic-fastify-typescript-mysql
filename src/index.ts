import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./db/db";
import dotenv from "dotenv";
import allRoutes from "./router/allRoutes";
// Load environment variables
dotenv.config();

const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
const host = process.env.SERVER_HOST || "0.0.0.0";
const protocol = process.env.SERVER_PROTOCOL || "http";

const fastify = Fastify({
  logger: true,
});
// CommonJs
const app = require("fastify")({
  logger: true,
});

app.register(cors);

app.register(require("@fastify/multipart"), {
  attachFieldsToBody: true, // Use 'true' instead of 'keyValues'
  onFile, // Custom handler for file processing
  limits: {
    fileSize: 6000000 * 10, // Limit file size to 60 MB
  },
});

app.register(require("@fastify/jwt"), {
  secret: "5a0d6f05-c127-466e-aea0-f248f0e4af69",
});
app.get("/", async (request: any, reply: any) => {
  return { message: "Hello, Fastify with TypeScript!" };
});

app.register(allRoutes, { prefix: "/api/v1/" });

// Sync database before starting the server
const startServer = async () => {
  try {
    await sequelize.sync(); // Creates table if not exists
    console.log("✅ Database connected & synced");

    await app.listen({ port, host });
    console.log(`🚀 Server running on ${protocol}://${host}:${port}`);
  } catch (err) {
    console.error("❌ Error starting server:", err);
    process.exit(1);
  }
};

startServer();

async function onFile(part: any) {
  if (part.type == "file" && part.filename) {
    const buff = await part.toBuffer();
    part.value = {
      data: await Buffer.from(buff, "base64"),
      name: part.filename,
      ext: "." + part.filename.split(".")[1],
    };
  }
  return part;
}
