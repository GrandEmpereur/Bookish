"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  BarChart2,
  Target,
  Home,
  List,
  Search,
  Users,
  User,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";

const friendsData = [
  {
    name: "Maren Workman",
    points: 325,
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    name: "Brandon Matroys",
    points: 124,
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    name: "Manuela Lipshutz",
    points: 437,
    bg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

export default function Statistiques() {
  const router = useRouter();
  const [isNative, setIsNative] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration and platform detection
  useEffect(() => {
    setIsMounted(true);
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  // Determine padding based on platform and hydration
  const topPadding = !isMounted
    ? "pt-[100px]"
    : isNative
      ? "pt-[130px]"
      : "pt-[100px]";

  return (
    <div className={cn("min-h-screen bg-gray-50 pb-20 relative", topPadding)}>
      <main className="px-4 space-y-6">
        {/* Battle Section */}
        <section>
          <h2 className="text-gray-800 font-semibold mb-3">Battle</h2>
          <div className="space-y-3">
            <Link href="classements" passHref>
              <div className="flex items-center bg-white rounded-lg border border-gray-200 p-4 cursor-pointer">
                <div className="p-3 rounded-lg bg-blue-100">
                  <BarChart2 className="text-blue-600" size={20} />
                </div>
                <div className="flex-1 ml-3">
                  <div className="font-medium text-gray-800">Classements</div>
                  <div className="text-gray-500 text-sm">Au cours du mois</div>
                </div>
                <ChevronRight className="text-gray-400" />
              </div>
            </Link>
            <Link
              href="objectifs"
              className="flex items-center bg-white rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition"
            >
              <div className="p-3 rounded-lg bg-pink-100">
                <Target className="text-pink-600" size={20} />
              </div>
              <div className="flex-1 ml-3">
                <div className="font-medium text-gray-800">Mes objectifs</div>
                <div className="text-gray-500 text-sm">Avez-vous bien lu ?</div>
              </div>
              <ChevronRight className="text-gray-400" />
            </Link>
          </div>
        </section>

        {/* Friends Section */}
        <section>
          <h2 className="text-gray-800 font-semibold mb-3">Amis</h2>
          <div className="space-y-2">
            {friendsData.map(({ name, points, bg, iconColor }) => (
              <div
                key={name}
                className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${bg}`}>
                    <User className={`${iconColor}`} size={20} />
                  </div>
                  <span className="ml-3 font-medium text-gray-800">{name}</span>
                </div>
                <span className="text-gray-500 text-sm">{points} points</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16">
        <button className="flex flex-col items-center text-gray-400">
          <Home size={20} />
          <span className="text-xs">Accueil</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <List size={20} />
          <span className="text-xs">Mes listes</span>
        </button>

        <button className="bg-green-700 text-white p-4 rounded-full -mt-6 shadow-lg">
          <Search size={24} />
        </button>

        <button className="flex flex-col items-center text-gray-400">
          <MessageCircle size={20} />
          <span className="text-xs">Clubs</span>
        </button>
        <button className="flex flex-col items-center text-gray-400">
          <User size={20} />
          <span className="text-xs">Profil</span>
        </button>
      </nav>
    </div>
  );
}
