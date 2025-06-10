import BookDetail from "@/components/book/book-detail";

export default function Page({ params }: { params: { id: string } }) {
  return <BookDetail id={params.id} />;
}
