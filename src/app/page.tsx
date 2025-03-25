import { ReviewForm } from '@/components/Review/ReviewForm';
import { Header } from '@/components/Common/Header';
import { Intro } from '@/components/Common/Intro';
import { Footer } from '@/components/Common/Footer';
import { createSearchParams, InferSearchParams } from 'next-typesafe-path';

const searchParams = createSearchParams(p => ({
  result: p.enumOr(['true', 'false'], 'true').optional()
}))

export type SearchParams = InferSearchParams<typeof searchParams>

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