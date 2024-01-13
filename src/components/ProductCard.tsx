import { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import PriceTag from "./PriceTag";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isNewer =
    Date.now() - new Date(product.createAt).getTime() < 1000 * 60 * 60 * 24 * 7;
    //check if the product was created <= seven days ago and render the NEW badge in line 31

  return (
    <Link
      href={`/products/${product.id}`}
      className="card w-full bg-base-100 transition-shadow hover:shadow-xl"
    >
      <figure>
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={800}
          height={400}
          className="h-32 sm:h-48 object-cover"
        />
      </figure>
      <div className="card-body text-base p-3 sm:p-8">
        <h2 className="card-title text-base sm:text-[20px]">{product.name}</h2>
        {isNewer && <div className="badge badge-secondary text-xs">NEW</div>}
        <p className="text-sm sm:hidden">{`${product.description.slice(0, 40)}${
          product.description.length > 40 ? "..." : ""
        }`}</p>
        <p className="text-base hidden sm:block">{`${product.description.slice(0, 80)}${
          product.description.length > 80 ? "..." : ""
        }`}</p>
        <PriceTag price={product.price} />
      </div>
    </Link>
  );
}
