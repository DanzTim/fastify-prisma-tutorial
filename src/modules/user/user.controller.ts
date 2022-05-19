import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";
import { createUserInput, LoginRequestSchema } from "./user.schema";
import { createUser, findUser } from "./user.service";

export async function createUserHandler(request: FastifyRequest<{ Body: createUserInput }>, response: FastifyReply) {
    const { body } = request;

    try {
        const user = createUser(body);
        return response.code(201).send(user)
    } catch (e) {
        console.log(e);
        return response.code(500).send(e)
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