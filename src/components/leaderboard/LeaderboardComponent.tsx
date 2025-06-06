import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Trophy } from "lucide-react"; // optional, for the little crown on #1
import { useState } from "react";

interface LeaderboardUser {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  position: 1 | 2 | 3;
}

interface CurrentUser {
  name: string;
  avatarUrl?: string;
  points: number;
}

interface AllUsers {
  id: string;
  name: string;
  avatarUrl?: string;
  points: number;
  position: number;
}

interface LeaderboardComponentProps {
  topUsers: LeaderboardUser[];
  currentUserRank: number;
  totalUsers: number;
  daysRemaining: number;
  currentUser?: CurrentUser;
  allUsers?: AllUsers[];
}

export function LeaderboardComponent({
  topUsers,
  currentUserRank,
  totalUsers,
  daysRemaining,
  allUsers = [
    { id: "1", name: "Alice Durand", points: 520, position: 1 },
    { id: "2", name: "Bob Martin", points: 480, position: 2 },
    { id: "3", name: "Clara Duval", points: 450, position: 3 },
    { id: "4", name: "David Dupont", points: 430, position: 4 },
    { id: "5", name: "Eva Moreau", points: 400, position: 5 },
    { id: "6", name: "Frank Leroy", points: 370, position: 6 },
    { id: "7", name: "Gina Lefevre", points: 350, position: 7 },
    { id: "8", name: "Hugo Bernard", points: 330, position: 8 },
  ],
  currentUser = {
    name: "Maren Workman",
    avatarUrl: "/avatar.png",
    points: 320,
  },
}: LeaderboardComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  // derive the list you actually want to show:
  const otherUsers = allUsers.filter((u) => u.position > 3);

  const betterThanPercentage = Math.round(
    (1 - currentUserRank / totalUsers) * 100
  );

  const badgeStyles: Record<1 | 2 | 3, { left: string; bottom: string }> = {
    1: { left: "50%", bottom: "270px" }, // tallest column
    2: { left: "20%", bottom: "210px" }, // middle-height column
    3: { left: "80%", bottom: " 170px" }, // shortest column
  };

  return (
    <div className="bg-[#CBDFCF] rounded-xl p-5 w-full my-20">
      {/* header */}
      <div className="pb-28">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#2D4D43] text-xl font-semibold">Classements</h3>
          <div className="text-[#FF8960] font-semibold text-sm">
            Plus que {daysRemaining} jours !
          </div>
        </div>

        {/* your rank */}
        <div className="bg-[#FF8960] text-white rounded-2xl px-5 py-4 mb-8 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="font-bold text-lg">#{currentUserRank}</div>
            <div className="text-sm">
              Vous faites mieux que {betterThanPercentage}% des autres joueurs !
            </div>
          </div>
        </div>
      </div>

      {/* podium + top-3 overlays */}
      <div className="relative h-[260px] w-full mb-6">
        {/* podium image */}
        <Image
          src="/leaderboard.svg"
          width={318}
          height={262}
          alt="Podium"
          className="mx-auto relative z-0"
        />

        {/* top-3 badges */}
        {topUsers.map((u) => {
          const style = badgeStyles[u.position];
          return (
            <div
              key={u.id}
              className="absolute z-10 flex flex-col items-center transform -translate-x-1/2"
              style={{ left: style.left, bottom: style.bottom }}
            >
              {u.position === 1 && (
                <Crown className="w-5 h-5 text-yellow-400 mb-1" />
              )}
              <Avatar className={u.position === 1 ? "w-14 h-14" : "w-12 h-12"}>
                <AvatarImage src={u.avatarUrl} alt={u.name} />
                <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="mt-2 text-sm font-medium text-[#2D4D43]">
                {u.name}
              </span>

              {/* new points badge */}
              <div className="inline-flex items-center bg-[#2F4F35] rounded-full px-2 py-1 mt-1">
                <span className="text-white font-semibold text-xs">
                  {u.points.toLocaleString()}
                </span>
                <Trophy className="ml-1 w-3 h-3 text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {/* below-podium: current user */}
      <div className="relative overflow-visible w-full max-w-sm mx-auto">
        {/* ALWAYS show this */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="w-full bg-white rounded-xl flex items-center justify-between px-5 py-4 shadow-xs z-10"
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-[#2D4D43]">
              {currentUser.name}
            </span>
          </div>
          <span className="text-sm font-semibold text-[#2D4D43]">
            {currentUser.points} points
          </span>
        </button>

        {/* ONLY show this list when open */}
        {isOpen && (
          <ul className="absolute bottom-full left-0 right-0 mb-2 z-20 bg-white rounded-xl shadow-lg divide-y divide-gray-200 overflow-hidden">
            {otherUsers.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={u.avatarUrl} alt={u.name} />
                    <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-[#2D4D43]">{u.name}</span>
                </div>
                <span className="text-sm font-semibold text-[#2D4D43]">
                  {u.points} points
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
