import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
const jwt = require("jsonwebtoken");

const authMiddleware = async (
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("authToken ")) {
      console.error("Authorization header missing or invalid");
      return res.status(401).send({ error: "User not authorized" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("Token missing from Authorization header");
      return res.status(401).send({ error: "User not authorized" });
    }
    try {
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decodeToken);

      (req as any).userData = decodeToken;
      done();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return res.status(401).send({ error: "Invalid token" });
    }
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(401).send({ error: "Invalid token" });
  }
};

export default authMiddleware;
