"use client";

import { useState } from "react";

export default function Unboarding() {
  const [showPopup, setShowPopup] = useState(true); // Affiché par défaut

  const handleClose = () => {
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 text-center w-[335px] h-[295px] relative">
        {/* Images /}
        <div className="flex justify-center items-center mb-4 relative">
          <img
            src="/path-to-star-left.png"
            alt="Star Left"
            className="w-4 h-4 absolute left-8 top-2"
          />
          <img src="/path-to-bear.png" alt="Bear" className="w-16 h-16 z-10" />
          <img
            src="/path-to-star-right.png"
            alt="Star Right"
            className="w-4 h-4 absolute right-8 top-2"
          />
        </div>

        {/ Texte /}
        <h2 className="font-bold text-lg mb-2">
          Bienvenue dans l’univers de Bookish !
        </h2>
        <p className="text-sm text-gray-600 mb-4 px-2">
          Entrez dans le monde de Bookish, partagez toutes vos découvertes,
          suivez vos avancées de lecture
        </p>

        {/ Bouton }
        <button
          onClick={handleClose}
          className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium"
        >
          Je commence !
        </button>
      </div>
    </div>
  );
}