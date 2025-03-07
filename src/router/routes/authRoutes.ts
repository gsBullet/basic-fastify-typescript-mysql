import { FastifyInstance } from "fastify";
import controller from "../../controller/authController";
import authMiddleware from "../../middleware/authMiddleware";

const authRoutes = async (fastify: FastifyInstance) => {
  const prefix = "/users";
  const controllerInstance = controller(fastify);

  // Public routes
  fastify
    .post(`${prefix}/singup`, controllerInstance.signup)
    .post(`${prefix}/login`, controllerInstance.login)

    // Register auth middleware plugin
    // .register(authMiddleware)

    // These routes will now be protected
    .get(`${prefix}/check-auth`, controllerInstance.checkAuth)

    .get(`${prefix}/logout`, controllerInstance.logout);
};

export default authRoutes;
