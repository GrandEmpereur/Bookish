'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from "motion/react";

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(0); // 1: forward, -1: backward
    const router = useRouter();
    
    const onboardingSteps = [
        {
            title: {
                start: "Découvrez de nouveaux ",
                highlight: "mondes"
            },
            description: "Plongez dans l'univers fascinant des livres et découvrez des histoires captivantes. Rejoignez notre communauté.",
            image: "/assets/onboarding/step1.png"
        },
        {
            title: {
                start: "Partagez vos lectures ",
                highlight: "préférées"
            },
            description: "Partagez vos avis, vos recommandations et découvrez de nouveaux livres grâce aux suggestions de notre communauté",
            image: "/assets/onboarding/step2.png"
        },
        {
            title: {
                start: "Discutez avec d'Autres ",
                highlight: "passionnés"
            },
            description: "Engagez-vous dans des discussions passionnantes avec d'autres amateurs de littérature. Partagez vos réflexions.",
            image: "/assets/onboarding/step3.png"
        }
    ];

    // Variants pour les animations
    const imageVariants = {
        initial: (direction: number) => ({
            x: direction > 0 ? '100%' : direction < 0 ? '-100%' : 0,
            opacity: 0,
            scale: 0.95
        }),
        animate: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
            }
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%' : '100%',
            opacity: 0,
            scale: 0.95,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 }
            }
        })
    };

    const contentVariants = {
        initial: (direction: number) => ({
            y: direction === 0 ? 20 : 0,
            x: direction > 0 ? 100 : direction < 0 ? -100 : 0,
            opacity: 0
        }),
        animate: {
            y: 0,
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0]
            }
        },
        exit: (direction: number) => ({
            y: 0,
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1.0]
            }
        })
    };

    const buttonVariants = {
        tap: { scale: 0.98 },
        hover: { 
            scale: 1.03,
            transition: { duration: 0.2 } 
        }
    };

    const pageTransition = {
        type: "spring",
        stiffness: 300,
        damping: 30
    };

    // Détection de la taille d'écran
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // Vérifier au chargement de la page
        checkScreenSize();
        
        // Ajouter un écouteur pour les changements de taille
        window.addEventListener('resize', checkScreenSize);
        
        // Nettoyage
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            // Animation avant redirection
            setDirection(1);
            localStorage.setItem('hasSeenOnboarding', 'true');
            // Délai pour permettre à l'animation de se terminer
            setTimeout(() => {
                router.push('/auth/login');
            }, 500);
        }
    };

    const handleSkip = () => {
        localStorage.setItem('hasSeenOnboarding', 'true');
        router.push('/auth/login');
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    // Animation au démarrage de la page
    useEffect(() => {
        // Initialisation avec direction 0 pour l'animation de départ
        setDirection(0);
    }, []);

    return (
        <motion.div 
            className="min-h-screen flex flex-col bg-background overflow-hidden md:flex-row md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Section Image avec bouton Skip */}
            <div className="h-[55vh] relative w-full bg-primary/5 overflow-hidden md:h-screen md:w-1/2">
                <motion.div
                    className="absolute top-[60px] right-5 z-10 safe-area-pt md:top-10 md:right-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    <Button
                        variant="link"
                        onClick={handleSkip}
                        className="text-white font-bold group"
                        asChild
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Passer
                            <motion.div
                                className="h-[1px] bg-white/70 w-0 group-hover:w-full mt-0.5"
                                transition={{ duration: 0.3 }}
                                whileHover={{ width: "100%" }}
                            />
                        </motion.div>
                    </Button>
                </motion.div>

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={`image-${currentStep}`}
                        custom={direction}
                        variants={imageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="w-full h-full"
                    >
                        <Image
                            src={onboardingSteps[currentStep].image}
                            alt="Onboarding"
                            fill
                            className="object-cover rounded-b-3xl"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            quality={90}
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Effet de dégradé au bas de l'image */}
                <motion.div 
                    className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/90 to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                />
            </div>

            {/* Texte et contenu */}
            <motion.div 
                className="flex-1 flex flex-col pt-[20px] px-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={`title-${currentStep}`}
                        className="mb-4"
                        variants={contentVariants}
                        custom={direction}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <h2 className="text-4xl font-bold font-heading text-center w-full max-w-[300px] mx-auto">
                            {onboardingSteps[currentStep].title.start}
                            <span className="relative inline-block">
                                <motion.span 
                                    className="text-secondary"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    {onboardingSteps[currentStep].title.highlight}
                                </motion.span>
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "100%", opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 0.4 }}
                                >
                                    <Image
                                        src="/underline.svg"
                                        alt="underline"
                                        width={130}
                                        height={10}
                                        className={cn(
                                            "absolute -bottom-5 left-1/2 -translate-x-1/2 w-full",
                                        )}
                                        priority
                                    />
                                </motion.div>
                            </span>
                        </h2>
                    </motion.div>
                </AnimatePresence>

                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={`description-${currentStep}`}
                        variants={contentVariants}
                        custom={direction}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <p className="font-body text-center text-sm pt-[20px] max-w-[400px] mx-auto">
                            {onboardingSteps[currentStep].description}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Section Contenu */}
                <div className="flex-1 flex flex-col pt-7 md:pt-12">
                    {/* Dots de progression */}
                    <div className="flex justify-center gap-3 mb-8 md:mb-12">
                        {onboardingSteps.map((_, index) => (
                            <motion.div
                                key={index}
                                className={`h-2 rounded-full cursor-pointer transition-colors ${
                                    index < currentStep ? 'bg-primary-400' : 
                                    index === currentStep ? 'bg-primary-800' : 
                                    'bg-primary-200'
                                } md:h-3`}
                                initial={false}
                                animate={{ 
                                    width: index === currentStep ? (isMobile ? 32 : 40) : (isMobile ? 8 : 12)
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30
                                }}
                                onClick={() => {
                                    setDirection(index > currentStep ? 1 : -1);
                                    setCurrentStep(index);
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                role="button"
                                aria-label={`Aller à l'étape ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-4 mt-auto pb-[30px] safe-area-pb md:pb-0">
                        <AnimatePresence mode="wait">
                            {currentStep > 0 && (
                                <motion.div
                                    className="flex-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={handlePrevious}
                                        className="w-full h-12 text-base md:h-14 md:text-lg relative overflow-hidden group"
                                        asChild
                                    >
                                        <motion.div
                                            variants={buttonVariants}
                                            whileTap="tap"
                                            whileHover="hover"
                                        >
                                            <motion.span 
                                                className="relative z-10"
                                                initial={false}
                                                whileHover={{ x: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                Précédent
                                            </motion.span>
                                            <motion.div 
                                                className="absolute inset-0 bg-primary/5 transform origin-right"
                                                initial={{ scaleX: 0 }}
                                                whileHover={{ scaleX: 1 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </motion.div>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        
                        <motion.div
                            className={cn(
                                currentStep === 0 ? "w-full" : "flex-1"
                            )}
                            initial={false}
                            animate={{ 
                                width: currentStep === 0 ? "100%" : "50%"
                            }}
                            transition={pageTransition}
                        >
                            <Button
                                onClick={handleNext}
                                className="w-full h-12 text-base md:h-14 md:text-lg relative overflow-hidden group"
                                asChild
                            >
                                <motion.div
                                    variants={buttonVariants}
                                    whileTap="tap"
                                    whileHover="hover"
                                >
                                    <motion.span 
                                        className="relative z-10"
                                        initial={false}
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {currentStep === onboardingSteps.length - 1 ? 'Commencer' : 'Suivant'}
                                    </motion.span>
                                    <motion.div 
                                        className="absolute inset-0 bg-primary-600 transform origin-left"
                                        initial={{ scaleX: 0 }}
                                        whileHover={{ scaleX: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
} 