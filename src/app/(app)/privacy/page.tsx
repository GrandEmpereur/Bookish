"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 p-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Button>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-gray-600">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-8">
        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Bookish ("nous", "notre", "l'application") respecte votre vie privée
            et s'engage à protéger vos données personnelles. Cette politique de
            confidentialité explique comment nous collectons, utilisons,
            stockons et protégeons vos informations lorsque vous utilisez notre
            application mobile de réseau social dédié à la lecture.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            2. Données Collectées
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.1 Informations que vous nous fournissez directement
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  <strong>Informations de compte</strong> : nom d'utilisateur,
                  adresse e-mail, mot de passe (chiffré)
                </li>
                <li>
                  <strong>Informations de profil</strong> : photo de profil,
                  biographie, préférences de lecture
                </li>
                <li>
                  <strong>Contenu généré</strong> : avis sur les livres,
                  commentaires, publications, photos
                </li>
                <li>
                  <strong>Informations de bibliothèque</strong> : livres lus, en
                  cours de lecture, liste d'envies
                </li>
                <li>
                  <strong>Interactions sociales</strong> : abonnements, likes,
                  partages, messages
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                2.2 Données collectées automatiquement
              </h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>
                  <strong>Données techniques</strong> : type d'appareil, système
                  d'exploitation, version de l'app
                </li>
                <li>
                  <strong>Données d'utilisation</strong> : fonctionnalités
                  utilisées, temps passé dans l'app
                </li>
                <li>
                  <strong>Données de localisation</strong> : uniquement si vous
                  l'autorisez explicitement
                </li>
                <li>
                  <strong>Cookies et identifiants</strong> : pour maintenir
                  votre session de connexion
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            3. Utilisation des Données
          </h2>
          <p className="text-gray-700 mb-4">
            Nous utilisons vos données pour :
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Fonctionnement du service
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Créer et gérer votre compte</li>
                <li>• Personnaliser votre expérience</li>
                <li>• Recommandations de livres</li>
                <li>• Interactions communautaires</li>
              </ul>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-900 mb-2">
                Amélioration du service
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Analyser l'utilisation</li>
                <li>• Développer de nouvelles fonctionnalités</li>
                <li>• Corriger les bugs</li>
                <li>• Assurer la sécurité</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            4. Partage des Données
          </h2>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800 font-medium">
              ⚡ Nous ne vendons jamais vos données personnelles.
            </p>
          </div>

          <p className="text-gray-700 mb-4">
            Partage limité dans les cas suivants :
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Prestataires de services</strong> : hébergement,
              analytiques, support client (sous contrat de confidentialité)
            </li>
            <li>
              <strong>Exigences légales</strong> : si requis par la loi ou pour
              protéger nos droits
            </li>
            <li>
              <strong>Consentement</strong> : si vous autorisez explicitement le
              partage
            </li>
            <li>
              <strong>Transfert d'entreprise</strong> : en cas de fusion ou
              acquisition (avec notification préalable)
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            5. Vos Droits
          </h2>
          <p className="text-gray-700 mb-4">
            Conformément au RGPD et aux lois applicables, vous disposez des
            droits suivants :
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                📋 Accès et portabilité
              </h3>
              <p className="text-sm text-gray-600">
                Consulter et recevoir une copie de vos données dans un format
                lisible
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">
                ✏️ Rectification et suppression
              </h3>
              <p className="text-sm text-gray-600">
                Corriger les informations inexactes et supprimer vos données
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">⏸️ Limitation</h3>
              <p className="text-sm text-gray-600">
                Limiter le traitement de vos données personnelles
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">🚫 Opposition</h3>
              <p className="text-sm text-gray-600">
                Vous opposer à certains usages de vos données
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            6. Sécurité des Données
          </h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">
              🔒 Mesures de protection
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Chiffrement des données en transit (HTTPS/TLS)</li>
              <li>• Chiffrement des mots de passe (hachage sécurisé)</li>
              <li>• Sauvegardes sécurisées et redondantes</li>
              <li>• Accès restreint aux données par notre équipe</li>
              <li>• Audits de sécurité réguliers</li>
            </ul>
          </div>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            7. Conservation des Données
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-800">Comptes actifs</span>
              <span className="text-gray-600">
                Tant que votre compte est actif
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-800">
                Comptes supprimés
              </span>
              <span className="text-gray-600">
                Suppression dans les 30 jours
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-800">
                Données de sauvegarde
              </span>
              <span className="text-gray-600">
                Suppression complète dans les 90 jours
              </span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
              <span className="font-medium text-gray-800">
                Données analytiques
              </span>
              <span className="text-gray-600">Anonymisées après 24 mois</span>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            8. Contact
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-900 mb-4">
              Pour exercer vos droits ou poser des questions :
            </h3>

            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-blue-800 w-20">E-mail :</span>
                <a
                  href="mailto:privacy@bookish-app.com"
                  className="text-blue-600 hover:underline"
                >
                  privacy@bookish-app.com
                </a>
              </div>

              <div className="flex items-center">
                <span className="font-medium text-blue-800 w-20">DPO :</span>
                <a
                  href="mailto:dpo@bookish-app.com"
                  className="text-blue-600 hover:underline"
                >
                  dpo@bookish-app.com
                </a>
              </div>
            </div>

            <p className="text-sm text-blue-700 mt-4">
              Vous pouvez également déposer une réclamation auprès de la CNIL
              (France) ou de votre autorité de protection des données locale.
            </p>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t pt-6">
          <p className="text-sm text-gray-500 text-center">
            Cette politique de confidentialité est effective à compter du{" "}
            {new Date().toLocaleDateString("fr-FR")}
            et s'applique à toutes les données collectées à partir de cette
            date.
          </p>
        </section>
      </div>
    </div>
  );
}
