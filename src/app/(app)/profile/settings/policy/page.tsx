"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PolicyPage: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="shadow-md rounded-xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Politique de confidentialité</h1>
                    <p className="mb-4">
                        Bienvenue sur Bookish, votre réseau social dédié aux lecteurs. Nous prenons votre vie privée très au sérieux. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations personnelles.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">1. Informations que nous collectons</h2>
                    <p className="mb-4">
                        Nous collectons les informations que vous nous fournissez directement, telles que votre nom, votre adresse e-mail, votre photo de profil, et les informations de votre profil de lecteur. Nous collectons également des informations sur vos interactions avec notre application, telles que les livres que vous avez lus, vos amis, et vos activités sur le réseau.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">2. Utilisation de vos informations</h2>
                    <p className="mb-4">
                        Nous utilisons vos informations pour fournir, personnaliser et améliorer nos services. Cela inclut l'affichage de votre profil aux autres utilisateurs, la recommandation de livres, et la personnalisation de votre expérience sur Bookish.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">3. Partage de vos informations</h2>
                    <p className="mb-4">
                        Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les cas suivants : avec votre consentement, pour se conformer à la loi, pour protéger nos droits, ou dans le cadre d'une fusion ou d'une acquisition.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">4. Sécurité de vos informations</h2>
                    <p className="mb-4">
                        Nous mettons en œuvre des mesures de sécurité pour protéger vos informations contre l'accès non autorisé, la modification, la divulgation ou la destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">5. Vos droits</h2>
                    <p className="mb-4">
                        Vous avez le droit d'accéder à vos informations personnelles, de les corriger, de les supprimer, et de limiter leur traitement. Vous pouvez exercer ces droits en nous contactant à l'adresse e-mail fournie dans l'application.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">6. Modifications de cette politique</h2>
                    <p className="mb-4">
                        Nous pouvons mettre à jour cette politique de confidentialité de temps en temps. Nous vous informerons de tout changement en publiant la nouvelle politique sur notre application. Nous vous encourageons à consulter cette politique régulièrement pour rester informé de nos pratiques en matière de confidentialité.
                    </p>
                    <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
                    <p>
                        Si vous avez des questions ou des préoccupations concernant cette politique de confidentialité, veuillez nous contacter à l'adresse e-mail suivante : support@bookish.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PolicyPage;
