import ClubDetails from "@/components/club/club-details";

export default async function Page({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;

  return <ClubDetails clubId={clubId} />;
}
