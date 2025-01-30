'use client';

import { Bell, Send } from "lucide-react";
import Link from 'next/link';

export function TopBar() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-background border-b z-50">
            <div className="px-5 py-4 flex items-center justify-between pt-12">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8">
                        <img 
                            src="/Bookish2.svg" 
                            alt="Bookish" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="text-lg font-medium">Bookish</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                        <Bell size={20} />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
} 