import prisma from '../../utils/prisma'
import { CreateProductInput } from './ProductSchema'

// export async function createProduct(data: CreateProductInput & { ownerId: number }) {
    // return prisma.product.create({data})
//     return prisma.product.create({data})
// }

export function getProducts(){
    return prisma.product.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            owner: {
                select: {
                    name: true,
                    email: true
                }
            }
        }
    })
}