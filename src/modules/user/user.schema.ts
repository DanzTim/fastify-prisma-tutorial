import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const createUserSchema = z.object({
    email: z.string({required_error: "Email is required", invalid_type_error: "Email is not of valid type"}).email(),
    name: z.string(),
    password: z.string({required_error: "Password is required", invalid_type_error: "Password is not of valid type"})
})

const responseUserSchema = z.object({
    id: z.number(),
    email: z.string({required_error: "Email is required", invalid_type_error: "Email is not of valid type"}).email(),
    name: z.string(),
})
type createUserInput = z.infer<typeof createUserSchema>

const loginRequestSchema = z.object({
    name: z.string({required_error: "Name is required"}),
    password: z.string({required_error: "Password is required"})
})
const loginResponseSchema = z.object({
    accessToken: z.string()
})
type LoginRequestSchema = z.infer<typeof loginRequestSchema>

const { schemas: userSchema, $ref } = buildJsonSchemas({createUserSchema, responseUserSchema, loginRequestSchema, loginResponseSchema})
export { createUserInput, userSchema, $ref, LoginRequestSchema }