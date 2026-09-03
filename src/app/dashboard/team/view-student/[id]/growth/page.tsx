import StudentPersonalGrowth from "@/components/modules/_student/StudentPersonalGrowth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StudentGrowthPage({ params }: PageProps) {
  const { id } = await params;

  return <StudentPersonalGrowth studentId={id} />;
}
