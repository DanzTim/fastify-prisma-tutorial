import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { createUserInput, LoginRequestSchema } from "./user.schema";

export async function createUser(input: createUserInput){

    let { password, ...rest } = input;
    let { hash, salt } = hashPassword(password)

    const user = await prisma.user.create({
        data: { ...rest, salt, password: hash }
    })
    return user
}

export async function findUser(name: string) {
    return await prisma.user.findFirst({
        where: {
            name
        }
    })
}