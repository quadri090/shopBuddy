import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import PriceTag from "@/components/PriceTag"
import { cache } from "react"
import { Metadata } from "next"
import AddToCartBtn from "./AddToCartBtn"
import { incrementProductQuantity } from "./actions"

interface ProductPageProps {
    params: {
        id: string
    }
}

const getProduct = cache(async (id: string) => {
    const product = await prisma.product.findUnique({where: {id}})
    //finds the unique product matching the provided id in the db
    if(!product) notFound();
    return product;
})


export async function generateMetadata(
    { params: {id}} : ProductPageProps
): Promise<Metadata> {
    const product = await getProduct(id);

    return {
        title: product.name + " - ShopBuddy",
        description: product.description,
        openGraph: {
            images: [{ url: product.imageUrl}]
        }
    }
}


export default async function ProductPage(
    { params: {id}} : ProductPageProps
) {
    const product = await getProduct(id);

    return (
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={500}
                height={500}
                className="rounded-lg"
                priority
            />
            <div className="">
                <h1 className='text-5xl font-bold'>{product.name}</h1>
                <PriceTag price={product.price} className="mt-4"/>
                <p className='py-6'>{product.description}</p>
                <AddToCartBtn productId={product.id} incrementProductQuantity={incrementProductQuantity}/>
          </div>
        </div>
    )
}