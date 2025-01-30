"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';

const App: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animation optimisée pour mobile
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

    // Réduire le délai pour une meilleure expérience mobile
    setTimeout(() => {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      if (isLoggedIn) {
        router.push('/auth/login');
      } else if (hasSeenOnboarding) {
        router.push('/auth/login');
      } else {
        router.push('/onboarding');
      }
    }, 2000); // Réduit à 2 secondes pour une meilleure réactivité mobile
  }, [router]);

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-primary safe-area-p">
      <div ref={containerRef} className="flex flex-col items-center gap-y-6 px-4">
        <Image 
          src="/bookish.svg" 
          width={80}  // Taille réduite pour mobile
          height={68} 
          alt="Logo" 
          priority
          className="w-20 md:w-24" // Responsive
        />
        <p ref={textRef} className="text-3xl md:text-4xl font-heading uppercase text-white font-bold">
          Bookish
        </p>
      </div>
    </div>
  );
};

export default App;
