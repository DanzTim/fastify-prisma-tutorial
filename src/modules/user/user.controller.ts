import prisma from "../../utils/prisma";
import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../../app";
import { hashPassword, verifyPassword } from "../../utils/hash";
import { createUserInput, LoginRequestSchema } from "./user.schema";
import { findUser } from "./user.service";

export async function createUserHandler(request: FastifyRequest<{ Body: createUserInput }>, response: FastifyReply) {
    const { body } = request;

    try {
        let { password, ...rest } = body;
        let { hash, salt } = hashPassword(password)
    
        const user = await prisma.user.create({
            data: { ...rest, salt, password: hash }
        })

        response.code(201).send(user)
    } catch (error) {
        console.log(error);
        return response.code(500).send({
            error: true,
            message: error
        })
    }

}

export async function loginHander(request: FastifyRequest<{Body: LoginRequestSchema }>, response: FastifyReply) {
    const { name, password: candidatePass } = request.body

    try {
        const user = await findUser(name)

        if(!user){
            return response.code(401).send({
                error: true,
                message: "Invalid credentials"
            })
        }

        const correctPassword = verifyPassword({
            candidatePassword: candidatePass,
            salt: user.salt,
            hash: user.password
        })

        if(!correctPassword){
            return response.code(401).send({
                error: true,
                message: "Invalid credentials"
            })
        }
        
        let { password, salt, ...rest } = user;
        return response.code(200).send({
            accessToken: server.jwt.sign(rest)
        })
    } catch (e) {
        console.log(e);
        return response.code(500).send(e)
    }
}

export async function getUsers(request: FastifyRequest, response: FastifyReply) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        })
        return users;
    } catch (error) {
        console.log(error);
        return response.code(500).send(error)
    }
}