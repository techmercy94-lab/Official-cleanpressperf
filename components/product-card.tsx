'use client'

interface ProductCardProps {
  name: string
  price: string
  desc: string
}

export function ProductCard({ name, price, desc }: ProductCardProps) {
  const handleAddToCart = () => {
    alert(`${name} added to cart! Affiliates earn 15% commission on this sale.`)
  }

  return (
    <div className="border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
      <div className="bg-slate-800 h-48 rounded mb-4 flex items-center justify-center">
        <span className="text-4xl">🧴</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-slate-400 text-sm mb-4">{desc}</p>
      <p className="text-2xl font-bold text-blue-400 mb-3">{price}</p>
      <p className="text-xs text-green-400 mb-3">Affiliates earn 15% commission</p>
      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  )
}
