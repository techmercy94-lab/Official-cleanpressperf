import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AlertCircle, ArrowRight } from 'lucide-react';

function CancelledPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Cancelled</h1>

          <p className="text-muted-foreground mb-6">
            Your payment has been cancelled. Your cart items are still saved and ready to checkout.
          </p>

          <div className="flex flex-col gap-3 pt-6">
            <Link
              href="/cart"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
            >
              Back to Cart
              <ArrowRight size={18} className="ml-2" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CancelledPage;
