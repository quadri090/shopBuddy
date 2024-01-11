import ProductCard from "@/components/ProductCard"
import { prisma } from "@/lib/db/prisma"
import { Metadata } from "next"
import { title } from "process"

interface SearchPageProps {
    searchParams: {query: string}
}

export function generateMetadata({searchParams: {query}}: SearchPageProps) : Metadata {
    return {
        title: `${query} - ShopBuddy`
    }
}

export default async function SearchPage({searchParams : {query}}:  SearchPageProps) {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {name: {contains: query, mode: "insensitive"}},
                {description: {contains: query, mode: "insensitive"}}
            ]
        }
    })

    if (products.length === 0) {
        return  (
            <div className="text-center">No products found</div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.map(product => (
                <ProductCard product={product} key={product.id} />
            ))}
        </div>
    )
}