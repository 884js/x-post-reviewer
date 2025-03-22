import { DraftList } from '@/components/Draft/DraftList';
import { ReviewForm } from '@/components/Review/ReviewForm';
export const runtime = "edge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DraftList />
      <ReviewForm />
    </div>
  );
}