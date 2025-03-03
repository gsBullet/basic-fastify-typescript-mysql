import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import DataModel from "../model/userModel";
// import { JSON } from "sequelize";
import moment from "moment/moment";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

export default function (fastify: FastifyInstance) {
  return {
    all: async function (req: FastifyRequest, res: FastifyReply) {
      let data = await DataModel.findAll();
      return res.status(200).send(data);
    },

    store: async function (req: FastifyRequest, res: FastifyReply) {
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
      console.log(data);
      // return res
      //   .status(200)
      //   .send({ data, message: "user created successfully" });

      if (!image) {
        return res.status(400).send({ error: "No file uploaded" });
      }

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

      try {
        const user = await DataModel.create(data);
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
    details: async function (req: FastifyRequest, res: FastifyReply) {
      const { id } = req.params as any;
      const user = await DataModel.findByPk(id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      return res.status(200).send(user);
    },
    update: async function (req: FastifyRequest, res: FastifyReply) {
      try {
        const { id } = req.params as any;
        const { name, email, password, user_id } = req.body as any;

        const user = await DataModel.findByPk(id);
        if (!user) return res.status(404).send({ error: "User not found" });
        // console.log(req.body);

        await user.update({ name, email, password, user_id });
        return res.status(200).send(user);
      } catch (error) {
        return res.code(500).send({ error: "Error updating user" });
      }
    },
    delete: async function (req: FastifyRequest, res: FastifyReply) {
      const { id } = req.params as any;
      const user = await DataModel.findByPk(id);
      if (!user) return res.status(404).send({ error: "User not found" });

      await user.destroy();
      return res.status(200).send({ message: "User deleted successfully" });
    },
    // delete: async function (req: FastifyRequest, res: FastifyReply) {}
  };
}
