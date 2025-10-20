
// src/app/dashboard/page.tsx
import { CardItem } from "@/components/CardItem";

export default function DashboardPage() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <CardItem
        title="Total Exams"
        value={12}
        icon="GraduationCap"
        heading="Exam Overview"
        description="Total number of exams available"
        gradientFrom="from-purple-500"
        gradientTo="to-indigo-600"
      />
      <CardItem
        title="Completed Exams"
        value={8}
        icon="Trophy"
        heading="Progress"
        description="Exams you have successfully completed"
        gradientFrom="from-green-500"
        gradientTo="to-emerald-600"
      />
      <CardItem
        title="Guidelines"
        value={6}
        icon="Book"
        heading="Study Resources"
        description="Helpful materials to prepare better"
        gradientFrom="from-yellow-500"
        gradientTo="to-orange-500"
      />
      <CardItem
        title="YouTube Videos"
        value={10}
        icon="Video"
        heading="Video Content"
        description="Watch tutorials and lectures"
        gradientFrom="from-red-500"
        gradientTo="to-pink-500"
      />
      <CardItem
        title="Rokomari Links"
        value={4}
        icon="Link2"
        heading="Bookstore Links"
        description="Buy helpful books online"
        gradientFrom="from-cyan-500"
        gradientTo="to-blue-500"
      />
      <CardItem
        title="New Notifications"
        value={3}
        icon="FileText"
        heading="Latest Updates"
        description="Check what's new and important"
        gradientFrom="from-gray-700"
        gradientTo="to-gray-900"
      />
    </div>
  );
}
