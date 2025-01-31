'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Home, Library, Search, Users, User } from "lucide-react";

const navigationItems = [
    {
        href: '/feed',
        label: 'Accueil',
        icon: Home
    },
    {
        href: '/library',
        label: 'Mes listes',
        icon: Library
    },
    {
        href: '/search',
        label: 'Search',
        icon: Search,
        isSearch: true
    },
    {
        href: '/clubs',
        label: 'Clubs',
        icon: Users
    },
    {
        href: '/profile',
        label: 'Profile',
        icon: User
    },
    {
        href: '/test/toast',
        label: 'Toast',
        icon: User
    }
];

export function BottomBar() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t pb-5 rounded-t-[30px] shadow-lg">
            <div className="flex justify-around items-end py-4 relative">
                {navigationItems.map((item) => (
                    <Link 
                        key={item.href}
                        href={item.href} 
                        className={cn(
                            "flex flex-col items-center gap-1 w-[20%]",
                            pathname === item.href ? "text-primary-500" : "text-muted-foreground"
                        )}
                    >
                        <div className={cn(
                            "flex items-center justify-center",
                            item.isSearch && "bg-primary p-4 rounded-full shadow-lg -mt-10 mb-1"
                        )}>
                            <item.icon 
                                size={item.isSearch ? 24 : 20} 
                                className={item.isSearch ? "text-white" : undefined}
                            />
                        </div>
                        <span className="text-xs">{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
} 