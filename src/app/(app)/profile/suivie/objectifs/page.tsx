"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";

type Objective = {
  id: string;
  title: string;
  points: number;
  completed: boolean;
};

export default function ObjectivesPage() {
  const router = useRouter();

  // state for each list
  const [today, setToday] = useState<Objective[]>([
    {
      id: "a",
      title: "Commente une critique d’un ami.",
      points: 37,
      completed: false,
    },
    { id: "b", title: "Lire 20 minutes.", points: 20, completed: true },
  ]);
  const [thisWeek, setThisWeek] = useState<Objective[]>([
    { id: "c", title: "Parrainage.", points: 37, completed: false },
    {
      id: "d",
      title: "Réagis aux publications des autres.",
      points: 80,
      completed: false,
    },
  ]);
  const [thisMonth, setThisMonth] = useState<Objective[]>([
    { id: "e", title: "Partager un article.", points: 50, completed: false },
  ]);

  // generic toggler
  const toggle = (
    list: Objective[],
    setList: React.Dispatch<React.SetStateAction<Objective[]>>,
    id: string
  ) => {
    setList(
      list.map((o) => (o.id === id ? { ...o, completed: !o.completed } : o))
    );
  };

  // render a vertical list of cards, all of which toggle on click
  const renderList = (
    items: Objective[],
    setter: React.Dispatch<React.SetStateAction<Objective[]>>
  ) => (
    <div className="space-y-2">
      {items.map((o) => (
        <div
          key={o.id}
          onClick={() => toggle(items, setter, o.id)}
          className={`
            flex items-center justify-between
            border rounded-lg px-4 py-3 cursor-pointer
            ${o.completed ? "opacity-50" : "opacity-100"}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg 
                ${o.completed ? "bg-gray-100" : "bg-gray-200"}`}
            />
            <span
              className={`text-sm font-medium text-gray-800 ${
                o.completed ? "line-through" : ""
              }`}
            >
              {o.title}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`
                inline-flex items-center rounded-full px-2.5 py-1
                ${o.completed ? "bg-yellow-200" : "bg-yellow-100"}
              `}
            >
              <span className="text-xs font-semibold text-yellow-800">
                {o.points}
              </span>
              <Trophy className="ml-1 w-4 h-4 text-yellow-800" />
            </div>
            <input
              type="checkbox"
              readOnly
              checked={o.completed}
              className="w-5 h-5 accent-green-600"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-6 my-24">
      {/* Banner with “Voir le classement” */}
      <div className="relative bg-yellow-50 rounded-lg px-4 py-3 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/radiant-bg.svg')] bg-contain bg-no-repeat opacity-10" />
        <div className="flex justify-between items-center relative">
          <span className="text-sm text-gray-700">
            Vous avez actuellement{" "}
            <span className="font-semibold">370 Prunes</span> !
          </span>
          <button
            onClick={() => router.push("/profile/suivie/classements")}
            className="flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
          >
            Voir le classement
            <Trophy className="w-5 h-5 text-green-700" />
          </button>
        </div>
      </div>

      {/* Sections */}
      <div>
        <h2 className="mb-2 text-gray-800 font-semibold">Aujourd’hui</h2>
        {renderList(today, setToday)}
      </div>
      <div>
        <h2 className="mb-2 text-gray-800 font-semibold">Cette semaine</h2>
        {renderList(thisWeek, setThisWeek)}
      </div>
      <div>
        <h2 className="mb-2 text-gray-800 font-semibold">Ce mois-ci</h2>
        {renderList(thisMonth, setThisMonth)}
      </div>
    </div>
  );
}
