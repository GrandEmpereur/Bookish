"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { bookListService } from "@/services/book-list.service";
import type { BookList } from "@/types/bookListTypes";
import {
  Book,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Star,
  Globe,
  Settings,
  User2,
  CircleDashed,
  Key,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// Mock data from stats page
const MONTHS_DATA = [
  {
    month: "Jan",
    width: "40%",
    images: ["/cover1.jpg", "/cover2.jpg"],
  },
  {
    month: "Feb",
    width: "20%",
    images: ["/cover3.jpg"],
  },
  {
    month: "Mar",
    width: "60%",
    images: ["/cover4.jpg"],
  },
  {
    month: "Apr",
    width: "45%",
    images: ["/cover5.jpg", "/cover6.jpg"],
  },
  {
    month: "May",
    width: "80%",
    images: ["/cover7.jpg"],
  },
  {
    month: "Jun",
    width: "55%",
    images: [],
  },
  {
    month: "Jul",
    width: "70%",
    images: [],
  },
  {
    month: "Aug",
    width: "30%",
    images: ["/cover8.jpg"],
  },
  {
    month: "Sep",
    width: "50%",
    images: [],
  },
  {
    month: "Oct",
    width: "0%",
    images: [],
  },
  {
    month: "Nov",
    width: "0%",
    images: [],
  },
  {
    month: "Dec",
    width: "0%",
    images: [],
  },
];

const GENRE_DATA = [
  { name: "Romance", value: 10 },
  { name: "Thriller", value: 6 },
  { name: "Fantasy", value: 4 },
  { name: "Autres", value: 2 },
];

const PIE_COLORS = ["#ec4899", "#dc2626", "#22c55e", "#ffffff"];

const MOCK_POSTS = [
  {
    id: "1",
    content:
      "Je viens de finir 'L'Étranger' de Camus, un chef-d'œuvre absolu ! Qu'en pensez-vous ?",
    created_at: "2024-03-15T10:30:00Z",
    likes_count: 24,
    comments_count: 8,
    author: {
      id: "1",
      username: "Alice",
      profile_picture_url: "/avatar.png",
    },
  },
  {
    id: "2",
    content:
      "Ma nouvelle collection de romans policiers commence à prendre forme ! Je vous partage mes dernières acquisitions.",
    created_at: "2024-03-14T15:20:00Z",
    likes_count: 15,
    comments_count: 3,
    author: {
      id: "2",
      username: "Bob",
      profile_picture_url: "/avatar.png",
    },
  },
];

const MOCK_REVIEWS = [
  {
    id: "1",
    book: {
      title: "1984",
      author: "George Orwell",
      coverImage: "https://example.com/1984.jpg",
    },
    rating: 4.5,
    content: "Une dystopie fascinante et toujours d'actualité...",
    created_at: "2024-03-10T09:00:00Z",
    likes_count: 12,
  },
  {
    id: "2",
    book: {
      title: "Dune",
      author: "Frank Herbert",
      coverImage: "https://example.com/dune.jpg",
    },
    rating: 5,
    content: "Un chef-d'œuvre de la science-fiction...",
    created_at: "2024-03-08T14:30:00Z",
    likes_count: 18,
  },
];

const MOCK_CLUBS = [
  {
    id: "1",
    name: "Club des Classiques",
    members_count: 156,
    current_book: "Les Misérables",
    next_meeting: "2024-03-20T18:00:00Z",
    image: "/club1.jpg",
  },
  {
    id: "2",
    name: "Science-Fiction Fans",
    members_count: 89,
    current_book: "Fondation",
    next_meeting: "2024-03-22T19:00:00Z",
    image: "/club2.jpg",
  },
];

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookLists, setBookLists] = useState<BookList[]>([]);
  const [isLoadingLists, setIsLoadingLists] = useState(false);

  const fetchBookLists = async () => {
    try {
      setIsLoadingLists(true);
      const response = await bookListService.getBookLists();
      setBookLists(response.data);
    } catch (error) {
      console.error("Error fetching book lists:", error);
      toast.error("Impossible de charger vos listes");
    } finally {
      setIsLoadingLists(false);
    }
  };

  useEffect(() => {
    fetchBookLists();
  }, []);

  const renderBookListSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="h-[120px] w-[80px]" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-dvh bg-background">
      <main className="container mx-auto pt-8 px-5 pb-[120px] max-w-md">
        {/* Header with profile info */}
        <div className="flex items-start space-x-4 mb-2 mt-20">
          <Avatar className="w-16 h-16 border-4 border-[#F3D7D7] bg-[#F3D7D7]">
            <AvatarImage
              src={user?.profile?.profile_picture_url ?? "/avatar.png"}
              alt={user?.username ?? undefined}
            />
            <AvatarFallback className="bg-[#F3D7D7]">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 flex flex-col">
            {/* Row 1: Name and genres */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">
                {user?.username || "Lucas"}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1">
                  {user?.profile?.preferred_genres?.[0] ?? "Thrillers"}
                </span>
                <span className="bg-[#F5F5F5] text-xs rounded-full px-3 py-1">
                  {user?.profile?.preferred_genres?.[1] ?? "Fiction"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/profile/settings")}
                  className="p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Row 2: Role badge under name, points to right */}
            <div className="flex justify-between items-center mt-2">
              <div className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 flex items-center space-x-1">
                <Key className="w-4 h-4" />
                <span className="text-xs font-medium">
                  Gardien des Histoires
                </span>
              </div>
              <span className="text-sm text-gray-500">4255 points</span>
            </div>
          </div>
        </div>

        {/* Description/bio under the header */}
        <p className="text-sm mt-4 text-gray-700 mb-8">
          {user?.profile?.bio ||
            "Fan de thriller et de romance mais j'aime aussi la fantasy et le scifi"}
        </p>

        {/* Stats counters - styled to match the green boxes in the image */}
        <div className="relative w-full max-w-md rounded-xl px-6 py-4 bg-[#2F4739] overflow-hidden">
          {/* Main content with dividers */}
          <div className="relative z-10 flex items-center justify-around">
            {/* Column 1: Points */}
            <div className="flex flex-col items-center">
              {/* Icon with slight transparency */}
              <Star
                className="w-6 h-6 mb-1 text-white/80"
                fill="currentColor"
              />
              {/* Label more transparent than the number */}
              <span className="text-xs uppercase text-white/70 tracking-wide">
                Points
              </span>
              {/* Number can be slightly more opaque */}
              <span className="text-xl font-bold text-white/90">590</span>
            </div>

            {/* Vertical divider */}
            <div className="h-8 w-px bg-white/30" />

            {/* Column 2: Followers */}
            <div className="flex flex-col items-center">
              <Globe
                className="w-6 h-6 mb-1 text-white/80"
                fill="currentColor"
              />
              <span className="text-xs uppercase text-white/70 tracking-wide">
                Followers
              </span>
              <span className="text-xl font-bold text-white/90">1,438</span>
            </div>

            {/* Vertical divider */}
            <div className="h-8 w-px bg-white/30" />

            {/* Column 3: Suivi(e)s */}
            <div className="flex flex-col items-center">
              <CircleDashed
                className="w-6 h-6 mb-1 text-white/80"
                fill="currentColor"
              />
              <span className="text-xs uppercase text-white/70 tracking-wide">
                Suivi(e)s
              </span>
              <span className="text-xl font-bold text-white/90">56</span>
            </div>
          </div>
        </div>

        {/* Tabs navigation - styled to match the image */}
        <div className="mt-6">
          <Tabs defaultValue="board" className="w-full">
            <div className="w-full mx-[-20px]">
              <TabsList className="w-full justify-between border-b border-b-gray-200 rounded-none bg-transparent h-auto pb-0 px-5 space-x-0">
                <TabsTrigger
                  value="board"
                  className="border-b-2 border-b-[#416E54] px-0 pb-2 pt-0 text-[15px] text-[#416E54] font-medium rounded-none bg-transparent h-auto data-[state=active]:shadow-none data-[state=inactive]:border-b-transparent data-[state=inactive]:text-gray-500"
                >
                  Board
                </TabsTrigger>
                <TabsTrigger
                  value="listes"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Listes
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="avis"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Avis
                </TabsTrigger>
                <TabsTrigger
                  value="clubs"
                  className="border-b-2 border-b-transparent px-0 pb-2 pt-0 text-[15px] text-gray-500 font-medium rounded-none bg-transparent h-auto data-[state=active]:border-b-[#416E54] data-[state=active]:text-[#416E54] data-[state=active]:shadow-none"
                >
                  Clubs
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="w-full mt-4">
              <TabsContent value="board" className="w-full space-y-6 mt-0">
                <div className="relative rounded-xl overflow-hidden bg-[#2F4739] p-6">
                  {/* Decorative circles */}
                  <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/5 rounded-full" />
                  <div className="absolute -bottom-10 -left-0 h-40 w-40 bg-white/10 rounded-full" />

                  {/* Card title */}
                  <h2 className="relative  text-white text-xl font-semibold mb-6 text-center">
                    Résumé de lecture
                  </h2>

                  {/* Stats cards */}
                  <div className="relative  grid grid-cols-3 gap-4">
                    {/* Genre le plus lus */}
                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-6">
                      <div className="flex justify-center w-full mb-1">
                        <Heart className="h-5 w-5 text-white" fill="white" />
                      </div>
                      <span className="text-[#2F4739] text-[10px] text-center whitespace-nowrap mb-3 font-semibold">
                        Genre le plus lus
                      </span>
                      <span className="text-[#ffffff] text-base font-semibold mt-1 text-center">
                        Romance
                      </span>
                      <div className="text-[#2F4739] text-[12px] text-center flex flex-col font-bold mt-7 whitespace-pre">
                        <span>Depuis le début</span>
                        <span>de l'année</span>
                      </div>
                    </div>

                    {/* 2024 goal */}
                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-6">
                      <div className="flex justify-center w-full mb-1">
                        <div className="bg-[#F3D7D7] rounded-full p-1 h-6 w-6 flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                              stroke="#333"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                              stroke="#333"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[#2F4739] text-[10px]  mb-3 text-center font-semibold">
                        2024 goal
                      </span>
                      <div className="text-[#ffffff] text-sm font-semibold mt-1 text-center whitespace-nowrap">
                        20 sur 50
                      </div>
                      <span className="text-[#2F4739] text-[16px] font-bold mt-7 text-center">
                        Livres
                      </span>
                    </div>

                    {/* Note moyenne */}
                    <div className="flex flex-col items-center bg-[#C5CFC9] rounded-lg p-6">
                      <div className="flex justify-center w-full mb-1">
                        <Star className="h-5 w-5 text-white" fill="white" />
                      </div>
                      <span className="text-[#2F4739] text-[10px] text-center whitespace-nowrap mb-3 font-semibold">
                        Note moyenne
                      </span>
                      <span className="text-[#ffffff] text-base font-semibold mt-1 text-center">
                        4.5
                      </span>
                      <span className="text-[#2F4739] text-[16px] font-bold mt-7 text-center">
                        Étoiles
                      </span>
                    </div>
                  </div>
                </div>

                {/* Monthly reading progress */}
                <div
                  className="rounded-lg p-6 mb-8 mx-auto"
                  style={{
                    background: "linear-gradient(to right, #6DA37F, #416E54)",
                  }}
                >
                  <div className="text-4xl font-bold text-white mb-1">24</div>
                  <div className="text-md text-white/90 mb-4">
                    Livres lus depuis le début d'année
                  </div>

                  <div className="space-y-3">
                    {MONTHS_DATA.map(({ month, width, images }) => (
                      <div key={month} className="flex items-center gap-3">
                        <div className="w-10 text-sm font-medium text-white/90">
                          {month}
                        </div>

                        <div className="flex-1 bg-white/10 h-6 rounded-md relative overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-6 bg-white/40"
                            style={{ width }}
                          />

                          {images.map((src, i) => (
                            <div
                              key={i}
                              className="absolute h-8 w-8 rounded-full overflow-hidden -top-1"
                              style={{ left: `${10 + i * 30}px` }}
                            >
                              <Image
                                src={src}
                                alt={`cover-${i}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Genre pie chart */}
                <div
                  className="rounded-lg p-6 mb-8 mx-auto"
                  style={{
                    background: "linear-gradient(to right, #6DA37F, #416E54)",
                  }}
                >
                  <h2 className="text-lg font-semibold mb-2">
                    Genre le plus lus depuis le début de l'année:{" "}
                    <span className="font-bold">ROMANCE</span>
                  </h2>
                  <p className="text-sm mb-4 text-white/90">
                    (Données factices)
                  </p>

                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={GENRE_DATA}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={5}
                        >
                          {GENRE_DATA.map((entry, index) => (
                            <Cell
                              key={`slice-${index}`}
                              fill={PIE_COLORS[index % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#333",
                            border: "none",
                            borderRadius: "4px",
                          }}
                          labelStyle={{ color: "#fff" }}
                          itemStyle={{ color: "#fff" }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Most read authors */}
                <div
                  className="rounded-lg p-6 mx-auto"
                  style={{
                    background: "linear-gradient(to right, #6DA37F, #416E54)",
                  }}
                >
                  <h2 className="text-lg font-semibold mb-4">
                    Auteurs les plus lus depuis le début de l'année
                  </h2>

                  <div className="flex justify-between text-sm">
                    <span>Stephen King</span>
                    <span>6 livres</span>
                  </div>
                  <div className="relative w-full bg-white/20 h-2 rounded-full mb-4">
                    <div
                      className="bg-white absolute top-0 left-0 h-2 rounded-full"
                      style={{ width: "60%" }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Patricia Briggs</span>
                    <span>4 livres</span>
                  </div>
                  <div className="relative w-full bg-white/20 h-2 rounded-full mb-4">
                    <div
                      className="bg-white absolute top-0 left-0 h-2 rounded-full"
                      style={{ width: "40%" }}
                    />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Madeline Miller</span>
                    <span>2 livres</span>
                  </div>
                  <div className="relative w-full bg-white/20 h-2 rounded-full">
                    <div
                      className="bg-white absolute top-0 left-0 h-2 rounded-full"
                      style={{ width: "20%" }}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Other tab contents */}
              <TabsContent value="listes" className="w-full">
                <div className="space-y-4">
                  {isLoadingLists ? (
                    renderBookListSkeleton()
                  ) : bookLists.length === 0 ? (
                    <div className="text-center py-8">
                      <Book className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-4 text-muted-foreground">
                        Vous n'avez pas encore créé de liste
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/library/create")}
                      >
                        Créer une liste
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {bookLists.map((list) => (
                        <button
                          key={list.id}
                          onClick={() => router.push(`/library/${list.id}`)}
                          className="w-full text-left"
                        >
                          <div className="flex gap-4 p-4 border rounded-lg hover:bg-accent transition-colors">
                            <div className="relative h-[120px] w-[80px] overflow-hidden rounded-md">
                              {list.coverImage ? (
                                <Image
                                  src={list.coverImage}
                                  alt={list.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Book className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">
                                  {list.name}
                                </h3>
                                <Badge
                                  variant={
                                    list.visibility === "private"
                                      ? "secondary"
                                      : "outline"
                                  }
                                >
                                  {list.visibility === "private"
                                    ? "Privé"
                                    : "Public"}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {list.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary">
                                  {list.bookCount} livre
                                  {list.bookCount > 1 ? "s" : ""}
                                </Badge>
                                <Badge variant="outline">{list.genre}</Badge>
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="posts" className="w-full">
                <div className="grid gap-4">
                  {MOCK_POSTS.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={post.author.profile_picture_url}
                            alt={post.author.username}
                          />
                          <AvatarFallback>
                            {post.author.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{post.author.username}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{post.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          {post.likes_count}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="avis" className="w-full">
                <div className="grid gap-4">
                  {MOCK_REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-[100px] w-[70px] flex-shrink-0">
                          <Image
                            src={review.book.coverImage}
                            alt={review.book.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{review.book.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {review.book.author}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.round(review.rating)
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.rating}/5
                            </span>
                          </div>
                          <p className="text-sm mt-2">{review.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="clubs" className="w-full">
                <div className="grid gap-4">
                  {MOCK_CLUBS.map((club) => (
                    <div
                      key={club.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden">
                          <Image
                            src={club.image}
                            alt={club.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{club.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {club.members_count} membres
                          </p>
                          <div className="mt-2">
                            <Badge variant="outline">
                              Lecture en cours : {club.current_book}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Prochaine réunion :{" "}
                            {new Date(club.next_meeting).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
