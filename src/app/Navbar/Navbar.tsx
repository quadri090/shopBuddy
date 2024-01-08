import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png"
import { redirect } from "next/navigation";
import { getCart } from "@/lib/db/carts";
import ShoppingCartBtn from "./ShoppingCartBtn";

async function searchProducts(formData: FormData) {
    "use server"; //directive for server action in server component
    const searchQuery = formData.get("searchQuery")?.toString();

    if (searchQuery) {
        redirect("/search?query" + searchQuery)
    }
}


export default async function Navabar()  {
    const cart = await getCart();

    return (
        <div className="bg-space-100">
            <div className="navbar max-w-7xl m-auto flex-col sm:flex-row gap-2">
                <div className="flex-1">
                    <Link href="/" className="btn btn-ghost text-xl">
                        <Image
                          src={logo}
                          alt="ShopBuddy logo"
                          width={40}
                          height={40}
                        />ShopBuddy
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    <form action={searchProducts}>
                        <div className="form-control">
                            <input
                                name="searchQuery"
                                placeholder="Search"
                                type="text"
                                className="input input-bordered w-full min-w-[200px]"
                                />
                        </div>
                    </form>
                    <ShoppingCartBtn
                        cart={cart}
                    />
                </div>
            </div>
        </div>
    )
}