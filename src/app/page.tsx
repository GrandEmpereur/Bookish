"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';
import { userService } from "@/services/user.service";
import { useToast } from "@/hooks/use-toast";

const App: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animation du logo
    tl.from(containerRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    tl.from(textRef.current, {
      y: 10,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    });

    const initializeApp = async () => {
      try {
        const response = await userService.getProfile();
        const currentPath = window.location.pathname;
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        console.log('hasSeenOnboarding', response);

        // Si l'utilisateur est authentifié
        if (response.data) {
          if (currentPath === '/' || currentPath.startsWith('/auth')) {
            router.replace('/feed');
          }
          return;
        }

        // Si on arrive ici, l'utilisateur n'est pas authentifié
        handleUnauthenticatedUser(hasSeenOnboarding);

      } catch (error: any) {
        // Si c'est une erreur 401, c'est normal - l'utilisateur n'est pas connecté
        if (error.status === 401) {
          const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
          handleUnauthenticatedUser(hasSeenOnboarding);
          return;
        }

        router.replace('/auth/login');
      }
    };

    const handleUnauthenticatedUser = (hasSeenOnboarding: string | null) => {
      if (!hasSeenOnboarding) {
        router.replace('/onboarding');
      } else if (!window.location.pathname.startsWith('/auth')) {
        router.replace('/auth/login');
      }
    };

    // Attendre que l'animation soit terminée
    setTimeout(initializeApp, 2000);
  }, [router, toast]);

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-primary safe-area-p">
      <div ref={containerRef} className="flex flex-col items-center gap-y-6 px-4">
        <Image 
          src="/bookish.svg" 
          width={80}
          height={68} 
          alt="Logo" 
          priority
          className="w-20 md:w-24"
        />
        <p ref={textRef} className="text-3xl md:text-4xl font-heading uppercase text-white font-bold">
          Bookish
        </p>
      </div>
    </div>
  );
};

export default App;
