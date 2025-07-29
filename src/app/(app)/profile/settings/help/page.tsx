"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Mail, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const HelpPage: React.FC = () => {
  const router = useRouter();

  const faqItems = [
    {
      question: "Comment créer une liste de livres ?",
      answer: "Rendez-vous dans la section 'Bibliothèque', puis cliquez sur 'Créer une liste'. Vous pouvez ensuite ajouter des livres, personnaliser le nom et la description de votre liste."
    },
    {
      question: "Comment suivre d'autres utilisateurs ?",
      answer: "Visitez le profil de l'utilisateur que vous souhaitez suivre et cliquez sur le bouton 'Suivre'. Vous pourrez voir leurs activités dans votre fil d'actualité."
    },
    {
      question: "Comment modifier mes préférences de lecture ?",
      answer: "Allez dans Paramètres > Profil et modifiez vos genres préférés, vos habitudes de lecture et vos objectifs annuels."
    },
    {
      question: "Comment configurer mes notifications ?",
      answer: "Dans Paramètres > Notifications, vous pouvez activer ou désactiver les notifications email et push selon vos préférences."
    },
    {
      question: "Comment supprimer mon compte ?",
      answer: "Dans Paramètres, vous trouverez l'option 'Supprimer le compte'. Attention, cette action est irréversible et supprimera toutes vos données."
    }
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pb-[120px] pt-25">
     
             {/* Contact Cards */}
       <div className="flex justify-center mb-6 mt-6">
         <div className="w-full max-w-md">
           <Card className="shadow-md rounded-xl">
             <CardContent className="p-6">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
                   <Mail className="h-6 w-6 text-green-600" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h3 className="font-semibold text-lg">Envoyer un email</h3>
                   <p className="text-gray-600 text-sm">support@bookish.com</p>
                 </div>
                 <div className="flex-shrink-0">
                   <Button 
                     variant="outline"
                     size="sm"
                     onClick={() => window.open('mailto:support@bookish.com?subject=Demande d\'aide - Bookish', '_blank')}
                   >
                     Contacter
                   </Button>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>
       </div>

             {/* FAQ Section */}
       <div className="flex justify-center">
         <div className="w-full max-w-md">
           <Card className="shadow-md rounded-xl">
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <HelpCircle className="h-5 w-5" />
                 Questions fréquentes
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
               {faqItems.map((item, index) => (
                 <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                   <h3 className="font-semibold text-lg mb-2 text-gray-800">
                     {item.question}
                   </h3>
                   <p className="text-gray-600 leading-relaxed">
                     {item.answer}
                   </p>
                 </div>
               ))}
             </CardContent>
           </Card>
         </div>
       </div>
    </div>
  );
};

export default HelpPage; 