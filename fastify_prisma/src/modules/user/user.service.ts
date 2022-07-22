import prisma from "../../utils/prisma";

export async function findUser(name: string) {
    return await prisma.user.findFirst({
        where: {
            name
        }
    })
}