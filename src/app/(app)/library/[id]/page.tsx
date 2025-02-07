import { BookListDetail } from "@/components/book-list-detail";

export default async function Page({ 
    params 
}: { 
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    return <BookListDetail id={id} />;
} 