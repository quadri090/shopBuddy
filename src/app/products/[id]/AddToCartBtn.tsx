"use client"

interface AddToCartBtnProps {
    productId: string,
}

export default function AddToCartBtn({productId}: AddToCartBtnProps) {
    return (
        <div className="flex items-center gap-2">
            <button
                className="btn btn-primary"
                onClick={() => {}}
            >Add to Cart :)
            </button>
        </div>
    )
}