'use client';

import Image from 'next/image';
import { Bell, Send, ChevronLeft, Search } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getTopBarConfig, TopBarConfig } from "@/config/navigation";
import { SearchDrawer } from "@/components/library/search-drawer";
import { SearchDialog } from "@/components/library/search-dialog";
import { useState } from "react";

interface TopBarProps {
    config?: TopBarConfig;
    className?: string;
    dynamicTitle?: string;
}

export function TopBar({ config, className, dynamicTitle }: TopBarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [searchOpen, setSearchOpen] = useState(false);
    const [modalType, setModalType] = useState<'drawer' | 'dialog' | null>(null);

    // On récupère la config de base
    const baseConfig = config || getTopBarConfig(pathname);

    // On modifie la config pour le dialogue de recherche
    const currentConfig = {
        ...baseConfig,
        rightIcons: baseConfig.rightIcons?.map(icon => {
            if (icon.icon === Search) {
                return {
                    ...icon,
                    onClick: () => {
                        setModalType(icon.modalType || 'dialog');
                        setSearchOpen(true);
                    }
                };
            }
            return icon;
        })
    };

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
                    <Image
                        src="/Bookish2.svg"
                        alt="Bookish"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                    />
                    <span className="text-lg font-medium">Bookish</span>
                </div>
            );
        }

        return <div className="w-8" />; // Espace réservé pour maintenir l'alignement
    };

    const handleIconClick = (iconConfig: NonNullable<TopBarConfig['rightIcons']>[number]) => {
        if (iconConfig.onClick) {
            iconConfig.onClick();
        } else if (iconConfig.href) {
            router.push(iconConfig.href);
        }
    };

    const renderRightIcons = () => {
        if (!currentConfig.rightIcons?.length) {
            return <div className="w-8" />; // Espace réservé
        }

        return (
            <div className="flex items-center gap-4">
                {currentConfig.rightIcons.map((iconConfig, index) => {
                    const Icon = iconConfig.icon;
                    return (
                        <Button
                            key={index}
                            variant="ghost"
                            onClick={() => handleIconClick(iconConfig)}
                            className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors"
                        >
                            <Icon size={20} />
                        </Button>
                    );
                })}
            </div>
        );
    };

    const renderTitle = () => {
        if (!currentConfig.title) return null;
        
        if (pathname.startsWith('/library/') && pathname !== '/library/create') {
            return dynamicTitle ? `Librairie - ${dynamicTitle}` : 'Librairie';
        }
        
        return currentConfig.title;
    };

    return (
        <>
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
                                {renderTitle()}
                            </h1>
                        )}
                    </div>

                    {/* Conteneur droit - même largeur que la gauche */}
                    <div className="w-[72px] flex justify-end">
                        {renderRightIcons()}
                    </div>
                </div>
            </header>
            
            {modalType === 'drawer' ? (
                <SearchDrawer 
                    open={searchOpen} 
                    onOpenChange={setSearchOpen}
                />
            ) : modalType === 'dialog' ? (
                <SearchDialog 
                    open={searchOpen} 
                    onOpenChange={setSearchOpen}
                />
            ) : null}
        </>
    );
} 