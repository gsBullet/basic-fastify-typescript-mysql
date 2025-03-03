import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import DataModel from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "@fastify/jwt";
export default function (fastify: FastifyInstance) {
  return {
    login: async (req: FastifyRequest, res: FastifyReply) => {
      const { email, password } = req.body as any;
      if (!email.value || !password.value) {
        return res
          .status(400)
          .send({ error: "Email and password are required" });
      }

      const user = await DataModel.findOne({ where: { email: email.value } });
      if (!user) {
        return res.status(400).send({ error: "User not found" });
      }

      if (!user.password) {
        return res.status(400).send({ error: "Password is missing" });
      }

      const pass = await bcrypt.compare(password.value, user.password);
      if (!pass) {
        return res.status(401).send({ error: "Invalid credentials" });
      }

      // Create JWT payload without sensitive information
      const payload = {
        id: user.id,
        user_id: user.user_id,
        email: user.email,
        image: user.image,
        // Add other non-sensitive user data if needed
      };

      // Sign token with secret and expiration
      const token = fastify.jwt.sign(
        {
          id: user.id,
          user_id: user.user_id,
          email: user.email,
          image: user.image,
        },
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).send({
        token,
        user: payload, // Optional: Send basic user data
      });
    },
    logout: async (req: FastifyRequest, res: FastifyReply) => {
      // Register logic here
      // Return JWT token or user object
    },
  };
}
