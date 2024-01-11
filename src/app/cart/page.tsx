import { getCart } from "@/lib/db/carts";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import { formatCurrency } from "@/lib/formatcurrency";

export const metadata = {
  title: "Your cart - ShopBuddy",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="">
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQuantity={setProductQuantity}
        />
      ))}
      {!cart?.items.length && <p>Your Cart is Empty</p>}
      <div className="flex flex-col items-end sm:items-center mr-6 sm:mr-0">
        <p className="mb-6 font-bold">
          Total: {formatCurrency(cart?.subtotal || 0)}
        </p>
        <button className="btn btn-primary sm:w-[200px]">CHECKOUT</button>
      </div>
    </div>
  );
}
