import { formatCurrency } from "@/lib/formatcurrency"

interface PriceTagProps {
    price: number,
    className?: string
}

export default function PriceTag({price, className} : PriceTagProps) {
    return (
        <span className={`badge ${className}`}>{formatCurrency(price)}</span>
    )
}