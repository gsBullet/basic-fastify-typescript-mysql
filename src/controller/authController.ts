import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import DataModel from "../model/userModel";
import bcrypt from "bcrypt";
import jwt from "@fastify/jwt";
import moment from "moment/moment";
import fs from "fs";
import path from "path";

import { FastifyPluginAsync } from 'fastify';

export default function (fastify: FastifyInstance) {
  return {
    signup: async function (req: FastifyRequest, res: FastifyReply) {
      const { user_id, name, email, password, image } = req.body as any;

      // **Hash the password using bcrypt**
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password.value, saltRounds);

      let data = {
        user_id: Number(user_id.value),
        name: String(name.value),
        email: String(email.value),
        password: String(hashedPassword),
      };

      if (!image) {
        return res.status(400).send({ error: "No file uploaded" });
      }

      try {
        const user = await DataModel.create(data);

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Handle file upload
        let imagePath = "";
        if (image?.file) {
          const filename = `${Date.now()}-${image.filename}`;
          imagePath = path.join(uploadDir, filename);
          await fs.promises.writeFile(imagePath, await image.toBuffer());
        }
        const relativePath = imagePath.split("/fastify/")[1];

        user.image = relativePath;
        await user.save();
        // image: relativePath,
        if (user) {
          return res.status(200).send({
            user,
            message: "user created successfully",
          });
        } else {
          return res.status(400).send({
            message: "user not created successfully",
          });
        }
      } catch (error) {
        return res.status(500).send({ error });
      }
    },
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
          expiresIn: "720h",
        }
      );

      return res.status(200).send({
        token,
        user: payload, // Optional: Send basic user data
      });
    },

    checkAuth: async (req: FastifyRequest, res: FastifyReply) => {
      try {
        const authHeader = req.headers.authorization;
        console.log("Authorization header:", authHeader); // Debug log
  
        if (!authHeader || !authHeader.startsWith("todoToken ")) { // Match frontend prefix
          console.log("Missing or invalid authorization header");
          return res.status(401).send({ error: "Unauthorized" });
        }
  
        const token = authHeader.split(" ")[1];
        if (!token) {
          console.log("Token missing");
          return res.status(401).send({ error: "Unauthorized" });
        }
  
        // Verify token
        const decoded = await fastify.jwt.verify(token);
        req.user = decoded;

        
        console.log("Authenticated user:", decoded); // Debug log
        return res.status(200).send({ userInfo: decoded }); // Optional: Send basic user data
      } catch (error) {
        console.log("Authentication error:", error);
        return res.status(401).send({ error: "Invalid token" });
      }
    },
    logout: async (req: FastifyRequest, res: FastifyReply) => {
      // Register logic here
      // Return JWT token or user object
    },
  };
}
