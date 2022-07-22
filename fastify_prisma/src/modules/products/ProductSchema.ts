import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInput = {
    name: z.string(),
    price: z.number(),
    content: z.string().optional()
}

const productGenerated = {
    id: z.number(),
    createdAt: z.string(),
    updatedAt: z.string()
}

const createProductRequest = z.object({
    ...productInput
})

const productResponse = z.object({
    ...productGenerated,
    ...productInput
})

const getProductsResponse = z.array(productResponse)

export type CreateProductInput = z.infer<typeof createProductRequest>

export const { schemas: productSchemas, $ref } = buildJsonSchemas({
    createProductRequest,
    productResponse,
    getProductsResponse
})