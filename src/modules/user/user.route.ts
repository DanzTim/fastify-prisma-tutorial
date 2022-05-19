import { FastifyInstance } from "fastify";
import { createUserHandler, loginHander } from "./user.controller";
import { $ref } from "./user.schema";

export default async function userRoutes(server: FastifyInstance) {

    server.post("/", {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('responseUserSchema')
            }
        }
    }, createUserHandler)

    server.post("/login", {
        schema: {
            body: $ref('loginRequestSchema'),
            response: {
                201: $ref('loginResponseSchema')
            }
        }
    }, loginHander)
}