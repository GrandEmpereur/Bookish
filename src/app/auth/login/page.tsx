'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // Ici, ajoutez votre logique d'authentification
        localStorage.setItem('isLoggedIn', 'true');
        // Rediriger vers le dashboard ou la page principale
        router.push('/dashboard');
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-background safe-area-p">
            <Button className="w-full h-11 mt-6">
                <Link href="/onboarding">
                    Commencer
                </Link>
            </Button>
            <Card className="w-full max-w-[380px] mx-auto">
                <CardHeader className="text-center space-y-2 pt-8">
                    <CardTitle className="text-xl md:text-2xl">Connexion</CardTitle>
                    <CardDescription className="text-sm md:text-base">
                        Bienvenue ! Veuillez vous connecter pour continuer
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm">Mot de passe</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <Button type="submit" className="w-full h-11 mt-6">
                            Se connecter
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 