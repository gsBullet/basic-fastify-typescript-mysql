import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./db/db";
import dotenv from "dotenv";
import userRouter from "./router/userRouter";

// Load environment variables
dotenv.config();

const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000;
const host = process.env.SERVER_HOST || "0.0.0.0";
const protocol = process.env.SERVER_PROTOCOL || "http";

const app = Fastify({ logger: true });

app.register(cors);

app.get("/", async (request, reply) => {
  return { message: "Hello, Fastify with TypeScript!" };
});

app.register(userRouter, { prefix: "/api/v1/" });

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
