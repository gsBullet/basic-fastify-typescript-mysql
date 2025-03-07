import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import jwt from "@fastify/jwt";

const authMiddleware = async (fastify: FastifyInstance) => {
  // Ensure JWT plugin is registered
  if (!fastify.jwt) {
    throw new Error("JWT plugin not registered");
  }

  fastify.addHook("preHandler", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = req.headers.authorization;
      console.log("Authorization header:", authHeader); // Debug log

      if (!authHeader || !authHeader.startsWith("todoToken ")) { // Match frontend prefix
        console.log("Missing or invalid authorization header");
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const token = authHeader.split(" ")[1];
      if (!token) {
        console.log("Token missing");
        return reply.status(401).send({ error: "Unauthorized" });
      }

      // Verify token
      const decoded = await fastify.jwt.verify(token);
      req.user = decoded;
      
      console.log("Authenticated user:", decoded); // Debug log
    } catch (error) {
      console.log("Authentication error:", error);
      return reply.status(401).send({ error: "Invalid token" });
    }
  });
};

export default authMiddleware;