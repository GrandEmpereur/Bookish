'use client';

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchDrawer({ open, onOpenChange }: SearchDrawerProps) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Rechercher une librairie</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                            autoFocus
                        />
                    </div>
                    <div className="mt-4">
                        {/* Résultats de recherche ici */}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
} 