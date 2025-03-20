import Hero from '@/components/ui/Hero';
import Features from '@/components/ui/Features';
import Testimonials from '@/components/ui/Testimonials';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function HomePage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
    </>
  );
}
