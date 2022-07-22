import { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prisma";
import { CreateProductInput } from "./ProductSchema";

export async function createProductHandler(request:FastifyRequest<{Body: CreateProductInput}>, reply:FastifyReply) {

    let { body } = request;
    
    try {
        const product = await prisma.product.create({
            data: {
                ...body,
                userId: request.user.id
            }
        })
        reply.send(product)
    } catch (error) {
        console.log(error);
        reply.code(500).send({
            "message": "Error cannot save product"
        })
    }
}