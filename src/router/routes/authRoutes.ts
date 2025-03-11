import { FastifyInstance } from "fastify";
import controller from "../../controller/authController";
import authMiddleware from "../../middleware/authMiddleware";

const authRoutes = async (fastify: FastifyInstance) => {
  const prefix = "/users";
  const controllerInstance = controller(fastify);

  // Public routes
  fastify
    .post(`${prefix}/register`, controllerInstance.signup)
    .post(`${prefix}/login`, controllerInstance.login)

 

    // These routes will now be protected
    .get(`${prefix}/check-auth`, { preHandler: [authMiddleware] }, controllerInstance.checkAuth)
    .get(`${prefix}/logout`, { preHandler: [authMiddleware] }, controllerInstance.logout);
};

export default authRoutes;
