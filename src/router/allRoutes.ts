import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { FastifyInstance } from "fastify";

export default async function allRoutes(fastify: FastifyInstance) {
  fastify.register(authRoutes);
  fastify.register(userRoutes);
}
