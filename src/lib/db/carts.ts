import { Cart, CartItem, Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { cookies } from "next/dist/client/components/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type CartWithProducts = Prisma.CartGetPayload<{ //fetching Cart instance with prisma
  include: { items: { include: { product: true } } }; //populate the cart with cartItems that is in relation to the cart
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{ //fetching CartItem instance with prisma
  include: { product: true }; //populate the cartItem with product that is in relation to the cart
}>;

export type ShoppingCart = CartWithProducts & {
  //adding new fields to the cart fetched with prisma
  size: number;
  subtotal: number;
};

export async function getCart(): Promise<ShoppingCart | null> {
  const session = await getServerSession(authOptions);

  let cart: CartWithProducts | null = null; //type annotation

  if (session) {
    cart = await prisma.cart.findFirst({
      //find the first cart collection that matches the id
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
    }); //fetch user cart
  } else {
    const localCartId = cookies().get("localCartId")?.value;
    cart = localCartId
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      })
    : null;
  }

  if (!cart) {
    return null;
  }

  return {
    ...cart,
    size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
    subtotal: cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    ),
  };
}

//if cart isnt found or local cart cookies does not exist
export async function CreateCart(): Promise<ShoppingCart> {
  const session = await getServerSession(authOptions);
  let newCart: Cart;

  if (session) {
    newCart = await prisma.cart.create({
      //prisma creates a new cart instance in the carts collections
      data: { userId: session.user.id },
    }); //create user cart
  } else {
    newCart = await prisma.cart.create({
      data: {},
    }); //create anonymous cart

    //needs encryption like jsonwebtoken
    cookies().set("localCartId", newCart.id);
  }

  return {
    ...newCart,
    items: [],
    size: 0,
    subtotal: 0,
  };
}

export async function mergeAnonymousCartIntoUserCart(userId: string) {
  const localCartId = cookies().get("localCartId")?.value;

  const localCart = localCartId //check if there's localCartId cookie
    ? await prisma.cart.findUnique({
        where: { id: localCartId },
        include: { items: true },
      }) //find a cart in the db that matches the localCartId cookie value
    : null; //do nothing if there's no localCartId

  if (!localCart) return; //end the execution

  const userCart = await prisma.cart.findFirst({
    where: { userId },
    include: { items: true },
  });// find a cart in the db whose id matches the userId argument passed into mergeAnonymousCartIntoUserCart function. This userid comes from the session, so the userCart is only for signed in users. 

  await prisma.$transaction(async (tx) => {//database transaction
    if (userCart) {//if theres a userCart
      const mergedCartItems = mergeCarts(localCart.items, userCart.items); //pass the values of the items in both localCart and userCart as arguments to the mergeCarts function and store it in a variable

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },//delete the existing cartIitems in the userCart
      });

      await tx.cartItem.createMany({//create new cartItem instances by mapping each item saved in the mergedCartItems variable
        data: mergedCartItems.map((item) => ({
          cartId: userCart.id,//the previous cartId of each item is modified to userCart.id. This is neccessary so the localCart cartItems will now have the userCart Id
          productId: item.productId,
          quantity: item.quantity,
        })),
      });
    } else { //if theres no user cart
      await tx.cart.create({ //create a new cart instance
        data: {
          userId,// userId coming from mergeAnonymousCartIntoUserCart userId function argument 
          items: {  
            createMany: {
              data: localCart.items.map((item) => ({//map items in the anonymous cart to create new cartItems
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
      });
    }
    await tx.cart.delete({
      where: { id: localCart.id },//delete anonymous cart in the db
    });
    cookies().set("localCartId", "");//delete anonymous localCart cookie
  });
}

  //type is set to an array of arrays of cartItem from prisma client
function mergeCarts(...cartItems: CartItem[][]) { 
  return cartItems.reduce((acc, items) => {
    items.forEach((item) => {
      const existingItem = acc.find((i) => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
}

//a dtatabase transaction is a process where multiple operations are executed simultaneously, if one of the operations fails, all transactions will be rolled backed and none will be executed.
