"use client";

import { LeaderboardComponent } from '@/components/leaderboard/LeaderboardComponent';
import React from 'react';

// Dummy data for top users
const topUsers: { id: string; name: string; avatarUrl: string; points: number; position: 1 | 2 | 3 }[] = [
  { id: '1', name: 'Alice Durand', avatarUrl: '/avatars/alice.png', points: 520, position: 1 },
  { id: '2', name: 'Bob Martin', avatarUrl: '/avatars/bob.png', points: 480, position: 2 },
  { id: '3', name: 'Clara Duval', avatarUrl: '/avatars/clara.png', points: 450, position: 3 },
];

const ClassementsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <LeaderboardComponent
          topUsers={topUsers}
          currentUserRank={5}
          totalUsers={100}
          daysRemaining={7}
          currentUser={{
            name: 'Maren Workman',
            avatarUrl: '/avatars/maren.png',
            points: 320,
          }}
        />
      </div>
    </div>
  );
};

export default ClassementsPage;
