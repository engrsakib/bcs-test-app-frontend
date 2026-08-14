import AnnouncementFormTemplate from "@/components/modules/_AnnouncementsClient/announcementFormTemplate";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAnnouncementPage({ params }: PageProps) {
  const { id } = await params;

  return <AnnouncementFormTemplate mode="edit" announcementId={id} />;
}
