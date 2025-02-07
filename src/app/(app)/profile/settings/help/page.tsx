"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const HelpPage: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="shadow-md rounded-xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Obtenir de l'aide</h1>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Comment créer un compte ?</h2>
                            <p>
                                Pour créer un compte, cliquez sur le bouton "S'inscrire" sur la page d'accueil et remplissez le formulaire d'inscription avec vos informations personnelles.
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Comment réinitialiser mon mot de passe ?</h2>
                            <p>
                                Si vous avez oublié votre mot de passe, cliquez sur "Mot de passe oublié" sur la page de connexion et suivez les instructions pour réinitialiser votre mot de passe.
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Comment ajouter un livre à ma liste de lecture ?</h2>
                            <p>
                                Pour ajouter un livre à votre liste de lecture, recherchez le livre dans la barre de recherche, puis cliquez sur le bouton "Ajouter à ma liste de lecture".
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Comment supprimer mon compte ?</h2>
                            <p>
                                Pour supprimer votre compte, allez dans les paramètres de votre profil, puis cliquez sur "Supprimer le compte". Suivez les instructions pour confirmer la suppression.
                            </p>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-gray-600">Si ces articles ne vous ont pas aidé, veuillez contacter notre support pour plus d'assistance.</p>
                        <Button className="mt-4" onClick={() => window.location.href = "mailto:support@bookish.com"}>Contacter le support</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
