import AuthorDetail from "@/components/author/author-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AuthorDetail id={id} />;
}
