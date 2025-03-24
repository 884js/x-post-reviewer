import { ReviewForm } from '@/components/Review/ReviewForm';
import { Header } from '@/components/Common/Header';
import { Intro } from '@/components/Common/Intro';
import { Footer } from '@/components/Common/Footer';

export const runtime = "edge";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-2 md:px-6">
      <Header />
      <Intro />
      <ReviewForm />
      <Footer />
    </main>
  );
}