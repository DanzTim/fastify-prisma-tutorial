import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchema } from "./modules/user/user.schema";
import fjwt from '@fastify/jwt';

export const server = Fastify()

server.get("/", async function () {
    return { status: "Fastify server is running" }
})

server.register(fjwt, {
    secret: "supersecret123"
})

server.decorate("auth",
    async (req: FastifyRequest, res: FastifyReply) => {
        try {
            await req.jwtVerify()
        } catch (error) {
            res.code(401).send(error)
        }
    }
)

for (const schema of userSchema) {
    server.addSchema(schema);    
}

server.register(userRoutes, { prefix: "api/user"})

async function main(){
    try {
        await server.listen(3000, '0.0.0.0')
        console.log("Fastify server running at localhost:3000!");
    } catch (e) {
        console.error(e);
        process.exit(1)
    }
}

main()