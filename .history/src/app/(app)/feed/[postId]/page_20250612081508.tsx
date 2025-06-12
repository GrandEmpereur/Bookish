import { PostDetails } from "@/components/post/post-details";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <PostDetails postId={postId} />;
}
