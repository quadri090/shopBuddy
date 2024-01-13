"use server";

import { CreateCart, getCart } from "@/lib/db/carts";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function incrementProductQuantity(productId: string) {
  const cart = (await getCart()) ?? (await CreateCart());

  const itemInCart = cart.items.find((item) => item.productId === productId);

  if (itemInCart) {
    await prisma.cartItem.update({
      where: { id: itemInCart.id },
      data: {
             quantity: { increment: 1 },
          },
    });
  } else {
    await prisma.cartItem.create({
      data: {
          cartId: cart.id,
          productId,
          quantity: 1
      }
    })

  }

  revalidatePath("/products/[id]");
}

//TO INITIATE THE OPERATION DIRECTLY ON THE CART SO THE "UPDATEDAT" OF THE CART WILL BE UPDATED EVERYTIME A CART ITEM IS UPDATED

// await prisma.cart.update({
//   where: { id: cart.id },
//   data: {
//     items: {
//       create: {
//         productId,
//         quantity: 1,
//       },
//     },
//   },
// });
