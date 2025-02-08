import { UserDetails } from "@/components/user/user-details";

export default async function Page({
    params,
}: {
    params: Promise<{ userId: string }>
}) {
    const { userId } = await params;
    
    return <UserDetails userId={userId} />;
} 