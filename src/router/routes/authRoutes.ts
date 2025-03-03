import { FastifyInstance } from "fastify";
import controller from "../../controller/authController";

const authRoutes = async (fastify: FastifyInstance) => {
  let prefix = "/users";
  const controllerInstance = controller(fastify);

  fastify
    .post(`${prefix}/login`, controllerInstance.login)
    .get(`${prefix}/logout`, controllerInstance.logout);
};

export default authRoutes;
