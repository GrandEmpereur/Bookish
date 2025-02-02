'use client';

import Image from 'next/image';
import { Bell, Send, ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTopBarConfig, TopBarConfig } from "@/config/navigation";

interface TopBarProps {
    config?: TopBarConfig;
    className?: string;
}

export function TopBar({ config, className }: TopBarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentConfig = config || getTopBarConfig(pathname);

    const renderLeftSide = () => {
        if (currentConfig.showBack) {
            return (
                <Button 
                    variant="ghost"
                    onClick={() => router.back()}
                    className="w-8 h-8 flex items-center justify-center"
                >
                    <ChevronLeft size={24} />
                </Button>
            );
        }

        if (currentConfig.showLogo) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8">
                        <Image 
                            src="/Bookish2.svg" 
                            alt="Bookish" 
                            width={32}
                            height={32}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="text-lg font-medium">Bookish</span>
                </div>
            );
        }

        return <div className="w-8" />; // Espace réservé pour maintenir l'alignement
    };

    const renderRightIcons = () => {
        if (!currentConfig.rightIcons?.length) {
            return <div className="w-8" />; // Espace réservé pour maintenir l'alignement
        }

        return (
            <div className="flex items-center gap-4">
                {currentConfig.rightIcons.map((iconConfig, index) => {
                    const Icon = iconConfig.icon;
                    return (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={iconConfig.onClick}
                            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center"
                        >
                            <Icon size={20} />
                        </Button>
                    );
                })}
            </div>
        );
    };

    return (
        <header className={cn("fixed top-0 left-0 right-0 bg-background border-b z-50", className)}>
            <div className="px-5 py-4 pt-12 flex items-center justify-between">
                {/* Conteneur gauche - même largeur que la droite */}
                <div className="w-[72px]">
                    {renderLeftSide()}
                </div>

                {/* Titre centré */}
                <div className="flex-1 flex justify-center">
                    {currentConfig.title && (
                        <h1 className="text-2xl font-heading">
                            {currentConfig.title}
                        </h1>
                    )}
                </div>

                {/* Conteneur droit - même largeur que la gauche */}
                <div className="w-[72px] flex justify-end">
                    {renderRightIcons()}
                </div>
            </div>
        </header>
    );
} 