"use client";

import { CartItemWithProduct } from "@/lib/db/carts";
import { formatCurrency } from "@/lib/formatcurrency";
import { Span } from "next/dist/trace";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

interface CartEntryProps {
  cartItem: CartItemWithProduct;
  setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}

export default function CartEntry({
  cartItem: { product, quantity },
  setProductQuantity,
}: CartEntryProps) {
  const [isPending, startTransition] = useTransition();

  //purpose of usetransition is not blocking the ui when server state update is done or when calling a server action from a client component. it is used to so any error that occurs in the server action does not break the website but is instead forwarded to the error page
  const quantityOptions: JSX.Element[] = []; //type of variable is set to jsx element, variable is an empty array
  for (let i = 1; i <= 99; i++) {
    quantityOptions.push(
      <option value={i} key={i}>
        {i}
      </option>,
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="h-[150px] w-[200px] rounded-lg object-cover"
        />
        <div>
          <Link href={"/products/" + product.id} className="font-bold">
            {product.name}
          </Link>
          <div>Price: {formatCurrency(product.price)}</div>
          <div className="my-1 flex items-center gap-2">
            Quantity:
            <select
              className=" select select-bordered w-full max-w-[80px]"
              defaultValue={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.currentTarget.value);
                startTransition(async () => {
                  await setProductQuantity(product.id, newQuantity);
                });
              }}
            >
              <option value={0}>0</option>
              {quantityOptions}
            </select>
          </div>
          <div className="flex items-center gap-2">
            Total: {formatCurrency(product.price * quantity)}
            {isPending && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
          </div>
        </div>
      </div>
      <div className="divider" />
    </div>
  );
}
