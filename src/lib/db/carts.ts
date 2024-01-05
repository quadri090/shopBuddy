import { Cart, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/dist/client/components/headers";

export type CartWithProducts = Prisma.CartGetPayload<{ //fetching db collections with prisma
    include: { items: {include: {product: true} } }
}>

export type ShoppingCart = CartWithProducts & {//adding new fields to the data fetched with prisma
    size: number,
    subtotal: number,
}

export async function getCart(): Promise<ShoppingCart | null> {
    const localCartId = cookies().get("localCartId")?.value
    const cart = localCartId ?
    await prisma.cart.findUnique({
        where: {id: localCartId},
        include: { items: {include: {product: true} } }
    //where tells prisma to find the cart matching the provided credentials, include tells prisma to include the CartItem in the cart(if any) and to also include the details of the product of CartItem
    })
    : null;

    if (!cart) {
        return null;
    }

    return {
        ...cart,
        size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        subtotal: cart.items.reduce(
            (acc, item) => acc + item.quantity * item.product.price, 0
        )
    }
}

//if cart isnt found or local cart cookies does not exist
export async function CreateCart(): Promise<ShoppingCart>{
    const newCart = await prisma.cart.create({//prisma creates a new cart instance in the carts collections
        data: {}
    })

    //needs encryption like jsonwebtoken
    cookies().set("localCartId", newCart.id);

    return {
        ...newCart,
        items: [],
        size: 0,
        subtotal: 0
    }
}