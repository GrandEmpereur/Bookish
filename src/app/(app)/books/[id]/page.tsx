import BookDetail from "@/components/book/book-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BookDetail id={id} />;
}
