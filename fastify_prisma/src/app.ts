import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import swagger from "fastify-swagger";
import userRoutes from "./modules/user/user.route";
import { userSchema } from "./modules/user/user.schema";
import { productSchemas } from "./modules/products/ProductSchema";
import fjwt, { JWT } from '@fastify/jwt';
import { withRefResolver } from "fastify-zod";
import { version } from "../package.json";
import ProductRoutes from "./modules/products/ProductRoute";

export const server = Fastify()

declare module 'fastify' {
    interface FastifyRequest {
        jwt: JWT;
    }

    export interface FastifyInstance {
        authenticate: any;
    }
}

declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            "id": number,
            "email": string,
            "name": string
        }
    }
}

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

server.addHook("preHandler", (req, reply, next) => {
    req.jwt = server.jwt;
    return next();
});

for (const schema of [...userSchema, ...productSchemas]) {
    server.addSchema(schema);    
}

server.register(
    swagger,
    withRefResolver({
        routePrefix: "/openapi",
        exposeRoute: true,
        staticCSP: true,
        openapi: {
            info: {
                title: "Fastify API",
                description: "Fastify Zod Prisma Typescript from Youtube channel TomDoesTech",
                version
            }
        }
    })
)

server.register(userRoutes, { prefix: "api/users"})
server.register(ProductRoutes, { prefix: "api/products"})

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