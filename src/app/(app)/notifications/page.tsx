"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "comment",
    read: false,
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
    user: {
      id: "user1",
      username: "théo",
      profile: {
        first_name: "Théo",
        last_name: "",
        profile_picture_url: "/img/memoji1.jpeg",
      },
    },
    data: {
      post_id: "post1",
      post_title: "Mon premier post",
      image_url: "/img/meal.jpg",
    },
  },
  {
    id: "2",
    type: "comment",
    read: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago (Thursday)
    user: {
      id: "user2",
      username: "Lucas",
      profile: {
        first_name: "Lucas",
        last_name: "",
        profile_picture_url: "/img/memoji2.jpg",
      },
    },
    data: {
      post_id: "post2",
      post_title: "Mon deuxième post",
      image_url: "/img/meal.jpg",
    },
  },
  {
    id: "3",
    type: "like",
    read: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago (Wednesday)
    user: {
      id: "user3",
      username: "Jeanne",
      profile: {
        first_name: "Jeanne",
        last_name: "",
        profile_picture_url: "/img/memoji3.png",
      },
    },
    data: {
      post_id: "post3",
      post_title: "Mon troisième post",
      image_url: "/img/meal.jpg",
    },
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Simulation du chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleNotificationClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return formatDistance(date, now, { addSuffix: false, locale: fr });
    }

    const weekday = date.toLocaleString("fr-FR", { weekday: "short" });
    return weekday;
  };

  const avatarBgColors = {
    Théo: "bg-yellow-100",
    Jeanne: "bg-blue-100",
    Lucas: "bg-green-100",
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* En-tête simple comme dans l'image des notifications */}
      <header className="flex items-center justify-between p-6 relative border-b">
        <button
          onClick={() => router.back()}
          className="absolute left-6 text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <h1 className="text-4xl font-bold w-full text-center">Notifications</h1>
      </header>

      <div className="flex-1">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ul className="bg-gray-50">
            {MOCK_NOTIFICATIONS.map((notification) => (
              <li
                key={notification.id}
                onClick={() =>
                  handleNotificationClick(notification.data.post_id)
                }
                className="flex items-center p-4 bg-gray-50 cursor-pointer"
              >
                <div
                  className={`h-14 w-14 rounded-full overflow-hidden ${
                    avatarBgColors[
                      notification.user.profile
                        .first_name as keyof typeof avatarBgColors
                    ] || "bg-gray-100"
                  } mr-3 shrink-0`}
                >
                  <Image
                    src={notification.user.profile.profile_picture_url}
                    alt={notification.user.profile.first_name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex-1 mr-3">
                  <div className="flex flex-col">
                    <div>
                      <span className="font-bold text-lg">
                        {notification.user.profile.first_name}
                      </span>
                      <span className="text-gray-500">
                        {" "}
                        {notification.type === "comment"
                          ? "a commenté votre post."
                          : "a liké votre post."}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      {formatNotificationTime(notification.created_at)}
                    </div>
                  </div>
                </div>

                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src="/img/meal.jpg"
                    alt="Post thumbnail"
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
