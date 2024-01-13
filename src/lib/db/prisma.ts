import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaBase = globalForPrisma.prisma ?? new PrismaClient();

export const prisma = prismaBase.$extends({
    query: {
        cart: {
            async update({args, query}) {
                args.data = { ...args, updatedAt: new Date() }
                return query(args);
            }
        }
    }
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaBase;

//last modification here is a prisma extension. it enables us to update the updatedAt field of a cart when a cartItem is updated. This is neccessary so we can track carts that havent been updated in a long time and delete the from our data base