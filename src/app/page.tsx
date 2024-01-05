import ProductCard from '@/components/ProductCard'
import { prisma } from '@/lib/db/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function Home() {
  const products = await prisma.product.findMany({ //prisma returns each product in product collection in db
    orderBy: {id: "desc"} //"desc" sorts the product from new to old using product id
  })

  return (
    <div>  
      <div className='hero rounded-xl bg-base-200'>
        <div className='hero-content flex-col lg:flex-row'>
          <Image
            src={products[0].imageUrl}
            alt={products[0].name}
            width={800}
            height={400}
            className='w-full max-w-sm rounded-lg shadow-2xl'
            priority //tells nextjs to load this image first
          />
          <div>
            <h1 className='text-5xl font-bold'>{products[0].name}</h1>
            <p className='py-6'>{products[0].description}</p>
            <Link href={"/products/" + products[0].id}
              className='btn btn-primary'
            >Check it Out!</Link>
          </div>
        </div>
      </div>
        <div className='my-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          {products.slice(1).map((product) => (
            <ProductCard product={product} key={product.id}/>
          ))}
        </div>
    </div>
  )
}
