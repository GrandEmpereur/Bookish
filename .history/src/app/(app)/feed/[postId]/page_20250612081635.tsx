import { PostDetails } from "@/components/post/post-details";
import { Unboarding } from "@/components/unboarding/";
export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return <PostDetails postId={postId} />;
}
