import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import DataModel from "../model/userModel";

export default function (fastify: FastifyInstance) {
  return {
    all: async function (req: FastifyRequest, res: FastifyReply) {
      let data = await DataModel.findAll();
      return res.status(200).send(data);
    },

    store: async function (req: FastifyRequest, res: FastifyReply) {
      try {
        const { user_id, name, email, password } = req.body as any;
        const user = await DataModel.create({ user_id, name, email, password });
        return res.status(200).send({message: "user created successfully",user});
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
        const { name, email, password } = req.body as any;

        const user = await DataModel.findByPk(id);
        if (!user) return res.status(404).send({ error: "User not found" });

        await user.update({ name, email, password });
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
  
    }
    // delete: async function (req: FastifyRequest, res: FastifyReply) {}
  };
}
