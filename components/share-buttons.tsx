'use client'

interface ShareButtonsProps {
  referralUrl: string
  affiliateCode: string
}

export function ShareButtons({ referralUrl, affiliateCode }: ShareButtonsProps) {
  const shareText = `Join me using my affiliate code: ${affiliateCode}`
  const fullShareText = `${shareText}\n${referralUrl}`

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(fullShareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}&quote=${encodeURIComponent(shareText)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(shareText)}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleShare('whatsapp')}
        className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors text-sm font-medium"
        title="Share on WhatsApp"
      >
        <span>WhatsApp</span>
      </button>

      <button
        onClick={() => handleShare('facebook')}
        className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
        title="Share on Facebook"
      >
        <span>Facebook</span>
      </button>

      <button
        onClick={() => handleShare('x')}
        className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-900 text-white rounded transition-colors text-sm font-medium"
        title="Share on X"
      >
        <span>X</span>
      </button>

      <button
        onClick={() => handleShare('telegram')}
        className="inline-flex items-center justify-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded transition-colors text-sm font-medium"
        title="Share on Telegram"
      >
        <span>Telegram</span>
      </button>
    </div>
  )
}
