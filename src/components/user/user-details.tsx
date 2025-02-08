'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface UserDetailsProps {
    userId: string;
}

export function UserDetails({ userId }: UserDetailsProps) {

    return (
        <div className="space-y-6 pb-5 pt-[120px]">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                            <User className="w-4 h-4" />
                        </AvatarFallback>
                    </Avatar> 
                    <div className="flex flex-col"> 
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">
                            @john.doe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 