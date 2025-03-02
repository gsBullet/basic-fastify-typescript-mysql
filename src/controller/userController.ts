import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import DataModel from "../model/userModel";
// import { JSON } from "sequelize";
import moment from "moment/moment";
import fs from "fs";
import path from "path";

export default function (fastify: FastifyInstance) {
  return {
    all: async function (req: FastifyRequest, res: FastifyReply) {
      let data = await DataModel.findAll();
      return res.status(200).send(data);
    },

    store: async function (req: FastifyRequest, res: FastifyReply) {
      const file = await req.file();
      const { user_id, name, email, password, image } = req.body as any;
      // console.log(image);
      if (!image) {
        return res.status(400).send({ error: "No file uploaded" });
      }

      const uploadDir = path.join(__dirname, "../uploads"); // Set upload directory
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(
        uploadDir,
        moment().format("YYYYMMDDHHmmss") + image.value.ext
      );
      const writeStream = fs.createWriteStream(filePath);
      await image.file.pipe(writeStream); // Save file
      try {
        // const user = await DataModel.create({ user_id, name, email, password });
        return res.status(200).send({filePath,writeStream, message: "user created successfully" });
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
