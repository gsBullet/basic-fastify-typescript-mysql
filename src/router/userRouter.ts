import { FastifyInstance } from "fastify";
import controller from "../controller/userController";

const userRouter = async (fastify: FastifyInstance) => {
  let prefix = "/users";
  const controllerInstance = controller(fastify);

  fastify
    .get(`${prefix}/all`, controllerInstance.all)
    .get(`${prefix}/find/:id`, controllerInstance.details)
    .post(`${prefix}/store`, controllerInstance.store)
    .post(`${prefix}/update/:id`, controllerInstance.update)
    .get(`${prefix}/delete/:id`, controllerInstance.delete);

};

export default userRouter;
