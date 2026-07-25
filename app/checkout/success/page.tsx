import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />

          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h1>

          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {params.session_id && (
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground mb-1">Session ID</p>
              <p className="font-mono text-xs break-all text-foreground">{params.session_id}</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your inbox with order details and tracking information.
            </p>

            <div className="flex flex-col gap-3 pt-6">
              <Link
                href="/orders"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
              >
                View Orders
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
      </div>

      <Footer />
    </div>
  );
}

export default SuccessPage;
