import FormButton from "@/components/FormButton";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";


export const metadata = {
    title: "Add Product - ShopBuddy" //meta data can be added to individual pages like this
}

async function addProduct(formData: FormData) {
    "use server"; //sam as use client directive

    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();
    const price = Number(formData.get("price") || 0);

    if (!name || !description || !imageUrl || !price) {
        throw new Error("Missing required fields")
    }

    await prisma.product.create({
        data: {name, description, imageUrl, price }
    })

    redirect("/")
}

export default function AddProductPage() {
    return (
        <div>
            <h1 className="text-lg mb-3 font-bold">Add Product</h1>
            <form action={addProduct}>
                <input
                    required
                    name="name"
                    placeholder="Name"
                    type="text"
                    className="mb-3 w-full input input-bordered"
                />
                <textarea
                    required
                    name="description" 
                    placeholder="Description" 
                    className="textarea textarea-bordered mb-3 w-full "
                />
                 <input
                    required
                    name="imageUrl"
                    placeholder="Image Url"
                    type="url"
                    className="mb-3 w-full input input-bordered"
                />
                 <input
                    required
                    name="price"
                    placeholder="9999"
                    type="number"
                    className="mb-3 w-full input input-bordered"
                />
                <FormButton className="btn-block">Add Product</FormButton>
            </form>
        </div>
    )
}