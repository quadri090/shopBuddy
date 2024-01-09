"use server";

import { CreateCart, getCart } from "@/lib/db/carts";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function setProductQuantity(productId: string, quantity: number) {
  const cart = (await getCart()) ?? (await CreateCart());

  const itemInCart = cart.items.find((item) => item.productId === productId);

  if (quantity === 0) {
    if (itemInCart) {
      await prisma.cartItem.delete({
        where: { id: itemInCart.id },
      });
    }
  } else {
    if (itemInCart) {
      await prisma.cartItem.update({
        where: { id: itemInCart.id },
        data: { quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }
  }
  revalidatePath("/cart");
}
