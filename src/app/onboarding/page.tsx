'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import gsap from 'gsap';

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const router = useRouter();

    // Refs pour les animations
    const imageRef = useRef(null);
    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonRef = useRef(null);

    const onboardingSteps = [
        {
            title: {
                start: "Découvrez de nouveaux ",
                highlight: "mondes"
            },
            description: "Plongez dans l'univers fascinant des livres et découvrez des histoires captivantes. Rejoignez notre communauté.",
            image: "/img/onboarding/presentation1.png"
        },
        {
            title: {
                start: "Partagez vos lectures ",
                highlight: "préférées"
            },
            description: "Partagez vos avis, vos recommandations et découvrez de nouveaux livres grâce aux suggestions de notre communauté",
            image: "/img/onboarding/presentation2.png"
        },
        {
            title: {
                start: "Discutez avec d'Autres ",
                highlight: "passionnés"
            },
            description: "Engagez-vous dans des discussions passionnantes avec d'autres amateurs de littérature. Partagez vos réflexions.",
            image: "/img/onboarding/presentation3.png"
        }
    ];

    // Animation de transition
    const animateContent = (direction: 'next' | 'prev') => {
        const xOffset = direction === 'next' ? 100 : -100;

        const tl = gsap.timeline();

        // Fade out
        tl.to([titleRef.current, descriptionRef.current], {
            opacity: 0,
            x: -xOffset,
            duration: 0.3,
            ease: "power2.inOut",
        });

        // Image zoom et fade
        tl.to(imageRef.current, {
            scale: 1.1,
            opacity: 0,
            duration: 0.3,
            ease: "power2.inOut",
        }, "<");

        // Changement de step
        tl.add(() => {
            setCurrentStep(prev =>
                direction === 'next' ? prev + 1 : prev - 1
            );
        });

        // Fade in du nouveau contenu
        tl.fromTo([titleRef.current, descriptionRef.current],
            {
                opacity: 0,
                x: xOffset,
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.4,
                ease: "power2.out",
            }
        );

        // Image apparaît
        tl.fromTo(imageRef.current,
            {
                scale: 0.9,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.4,
                ease: "power2.out",
            },
            "<"
        );
    };

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            animateContent('next');
        } else {
            // Animation de sortie finale
            const tl = gsap.timeline();
            tl.to([titleRef.current, descriptionRef.current, imageRef.current, buttonRef.current], {
                opacity: 0,
                y: -20,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.inOut",
                onComplete: () => {
                    localStorage.setItem('hasSeenOnboarding', 'false');
                    router.push('/auth/login');
                }
            });
        }
    };

    return (
        <div className="min-h-[100dvh] flex flex-col bg-background overflow-hidden">
            {/* Section Image avec bouton Skip */}
            <div className="h-[45vh] relative w-full bg-primary/5 overflow-hidden">
                <div ref={imageRef} className="w-full h-full">
                    <Image
                        src={onboardingSteps[currentStep].image}
                        alt="Onboarding"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={90}
                        priority
                    />
                </div>
            </div>

            {/* Texte */}
            <div className="flex-1 flex flex-col pt-[30px] px-6">
                <div ref={titleRef}>
                    <h2 className="text-[32px] leading-tight font-heading mb-4 text-center w-[300px] mx-auto">
                        {onboardingSteps[currentStep].title.start}
                        <span className="relative inline-block">
                            <span className="text-[#D46B45]">
                                {onboardingSteps[currentStep].title.highlight}
                            </span>
                            <Image
                                src="/underline.svg"
                                alt="underline"
                                width={130}
                                height={10}
                                className="absolute -bottom-[30px] left-1/2 -translate-x-1/2 w-full"
                                priority
                            />
                        </span>
                    </h2>
                </div>

                <div ref={descriptionRef}>
                    <p className="text-center text-base pt-[30px]">
                        {onboardingSteps[currentStep].description}
                    </p>
                </div>

                {/* Section Contenu */}
                <div className="flex-1 flex flex-col pt-7">
                    {/* Dots de progression */}
                    <div className="flex justify-center gap-3 mb-8">
                        {onboardingSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-300 ease-in-out ${index === currentStep
                                        ? 'w-8 bg-primary-800'
                                        : index < currentStep
                                            ? 'w-2 bg-primary-400'
                                            : 'w-2 bg-primary-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Bouton Suivant */}
                    <div ref={buttonRef} className="pb-[63px] safe-area-pb">
                    <Button
                    onClick={handleNext}
                         className="w-full h-12 text-base shadow-md shadow-black/30"
                    >
                    {currentStep === onboardingSteps.length - 1 ? 'Commencer' : 'Suivant'}
                    </Button>
                    </div>
                </div>
            </div>
        </div>
    );
} 