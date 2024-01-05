import { Product } from "@prisma/client"
import Link from "next/link"
import Image from "next/image"
import PriceTag from "./PriceTag"

interface ProductCardProps {
    product: Product
}

export default function ProductCard({product}: ProductCardProps) {
    const isNewer = Date.now() - new Date(product.createAt).getTime() < 1000 * 60 *  60 * 24 * 7

    return (
        <Link
            href={`/products/${product.id}`}
            className="card w-full bg-base-100 hover:shadow-xl transition-shadow"
        >
            <figure>
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={800}
                    height={400}
                    className="h-48 object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {product.name}
                </h2>
                {isNewer && <div className="badge badge-secondary text-xs">NEW</div>}
                <p>{product.description}</p>
                <PriceTag
                    price={product.price}
                />
            </div>
        
        </Link>
    )
}