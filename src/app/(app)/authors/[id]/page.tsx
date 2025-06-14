import AuthorDetail from "@/components/author/author-detail";

export default function Page({ params }: { params: { id: string } }) {
  return <AuthorDetail id={params.id} />;
}
