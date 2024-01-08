import { getCart } from "@/lib/db/carts";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import { formatCurrency } from "@/lib/formatcurrency";

export const metadata = {
    title: "Your cart - ShopBuddy"
};

export default async function CartPage() {
    const cart = await getCart();

    return (
        <div className="">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cart?.items.map(cartItem => (
                <CartEntry 
                    cartItem={cartItem} 
                    key={cartItem.id}
                    setProductQuantity={setProductQuantity}
                />
            ))}
            {!cart?.items.length && <p>Your Cart is Empty</p> }
            <div className="flex flex-col items-end sm:items-center">
                <p className="mb-6 font-bold">
                    Total: {formatCurrency(cart?.subtotal || 0)}
                </p>
            <button className="btn btn-primary sm:w-[200px]">CHECKOUT</button>
            </div>
        </div>
    )
}