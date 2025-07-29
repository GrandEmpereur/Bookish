import UserDetails from "@/components/user/user-details";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {

  return <UserDetails />;
}
