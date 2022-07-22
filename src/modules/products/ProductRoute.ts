import { FastifyInstance } from "fastify";
import { createProductHandler } from "./ProductController";
import { $ref } from "./ProductSchema";

export default async function ProductRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: server.authenticate,
      schema: {
        body: $ref("createProductRequest"),
        response: {
          201: $ref("productResponse"),
        },
      },
    },
    createProductHandler
  );
}
