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
        const response = await userService.getAuthenticatedProfile();
        if (response.data) {
          router.replace('/feed');
          return;
        }
      } catch (error: any) {
        // Si c'est une erreur 401, c'est normal - l'utilisateur n'est pas connecté
        if (error.status === 401) {
          const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
          if (!hasSeenOnboarding) {
            router.replace('/onboarding');
          } else {
            router.replace('/auth/login');
          }
          return;
        }

        // Pour les autres erreurs, on redirige vers login
        console.error('Init error:', error);
        router.replace('/auth/login');
      }
    };

    // Attendre que l'animation soit terminée avant de vérifier l'auth
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

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  );
};

export default App;
