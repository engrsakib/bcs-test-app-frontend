import UpdateBook from "@/components/modules/_Book/UpdateBook";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UpdateBookPage({ params }: PageProps) {
  const { id } = await params;
  return <UpdateBook bookId={String(id ?? "")} />;
}
