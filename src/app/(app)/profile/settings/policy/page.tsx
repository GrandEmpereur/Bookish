"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Database, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const PolicyPage: React.FC = () => {
  const router = useRouter();

  const sections = [
    {
      icon: Database,
      title: "Collecte des données",
      content: "Nous collectons les informations que vous nous fournissez directement, comme votre nom, adresse email, préférences de lecture et listes de livres. Nous collectons également des données d'utilisation pour améliorer notre service."
    },
    {
      icon: Eye,
      title: "Utilisation des données",
      content: "Vos données sont utilisées pour personnaliser votre expérience, vous recommander des livres, vous connecter avec d'autres lecteurs et améliorer nos services. Nous ne vendons jamais vos données personnelles."
    },
    {
      icon: Lock,
      title: "Protection des données",
      content: "Nous utilisons des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la perte ou la destruction."
    },
    {
      icon: Shield,
      title: "Partage des données",
      content: "Nous ne partageons vos données qu'avec votre consentement explicite ou lorsque cela est nécessaire pour fournir nos services. Nous ne vendons ni ne louons jamais vos informations personnelles."
    }
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pb-[120px] pt-25">

      {/* Introduction */}
      <Card className="shadow-md rounded-xl mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Notre engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            Chez Bookish, nous nous engageons à protéger votre vie privée et à être transparents 
            sur la façon dont nous collectons, utilisons et partageons vos informations. Cette 
            politique explique nos pratiques en matière de confidentialité.
          </p>
        </CardContent>
      </Card>

      {/* Main Sections */}
      <div className="space-y-4">
        {sections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <Card key={index} className="shadow-md rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-green-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Your Rights */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Vos droits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Droit d'accès</h4>
                <p className="text-gray-600 text-sm">Vous pouvez demander une copie de vos données personnelles.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Droit de rectification</h4>
                <p className="text-gray-600 text-sm">Vous pouvez corriger vos données inexactes ou incomplètes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Droit d'effacement</h4>
                <p className="text-gray-600 text-sm">Vous pouvez demander la suppression de vos données.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold">Droit à la portabilité</h4>
                <p className="text-gray-600 text-sm">Vous pouvez récupérer vos données dans un format structuré.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed mb-4">
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
            contactez-nous :
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email :</strong> privacy@bookish.com</p>
            <p><strong>Adresse :</strong> 123 Rue des Livres, 75001 Paris, France</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-gray-500 text-sm">
        Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
      </div>
    </div>
  );
};

export default PolicyPage; 