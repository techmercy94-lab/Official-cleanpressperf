import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';

function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Profile feature coming soon</p>
          <Link href="/shop" className="text-primary hover:text-secondary">
            Back to Shop
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default ProfilePage;
