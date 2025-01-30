"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';
import { authService } from "@/services/auth.service";

const App: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef(null);
  const textRef = useRef(null);

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

    const checkAuthAndRedirect = async () => {
      try {
        const userData = await authService.checkAuth();
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');

        if (userData) {
          // Si l'utilisateur est authentifié, redirection vers feed
          router.replace('/feed');
        } else if (hasSeenOnboarding) {
          // Si non authentifié mais a vu l'onboarding
          router.replace('/auth/login');
        } else {
          // Première visite
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // En cas d'erreur, on considère l'utilisateur comme non authentifié
        if (localStorage.getItem('hasSeenOnboarding')) {
          router.replace('/auth/login');
        } else {
          router.replace('/onboarding');
        }
      }
    };

    // Attendre que l'animation soit terminée avant de vérifier l'auth
    setTimeout(checkAuthAndRedirect, 2000);
  }, [router]);

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
