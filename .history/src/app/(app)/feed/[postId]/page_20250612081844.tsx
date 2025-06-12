import { PostDetails } from "@/components/post/post-details";
import { Unboarding } from "@/components/unboarding/unboarding-popup";

export default async function Page({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <>
      <Unboarding />
      <PostDetails postId={postId} />
    </>
  );
}
