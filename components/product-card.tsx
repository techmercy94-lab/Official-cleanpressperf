'use client'

import Image from 'next/image'

interface ProductCardProps {
  name: string
  price: string
  desc: string
}

export function ProductCard({ name, price, desc }: ProductCardProps) {
  const handleAddToCart = () => {
    alert(`${name} added to cart! Affiliates earn $1 commission on this sale.`)
  }

  const imageMap: Record<string, string> = {
    'Blushé': '/blushe.png',
    'Crimson': '/crimson.png',
    'Verde': '/verde.png',
    'Aureo': '/aureo.png',
    'Sterling': '/sterling.png',
  }

  const imageSrc = imageMap[name] || '/perfumes.png'

  return (
    <div className="border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
      <div className="relative w-full h-56 rounded mb-4 overflow-hidden bg-slate-800">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-contain p-3"
        />
      </div>

      <h3 className="text-xl font-semibold mb-2">{name}</h3>

      <p className="text-slate-400 text-sm mb-4">
        {desc}
      </p>

      <p className="text-2xl font-bold text-blue-400 mb-3">
        {price}
      </p>

      <p className="text-xs text-green-400 mb-3">
        Affiliates earn <strong>$1</strong> per sale (25%)
      </p>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors cursor-pointer"
      >
        Add to Cart
      </button>
    </div>
  )
}
