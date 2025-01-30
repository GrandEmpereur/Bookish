'use client';

import { useState } from 'react';
import { User } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { BottomBar } from "@/components/layout/bottom-bar";

interface Post {
    id: string;
    author: {
        name: string;
        book: string;
        avatar?: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    bookmarked: boolean;
}

export default function Feed() {
    const [posts] = useState<Post[]>([
        {
            id: '1',
            author: {
                name: 'Leonardo',
                book: 'A Game of Thrones',
            },
            content: 'Je viens de terminer "Game of Thrones" de George R.R. Martin et wow, quelle aventure épique',
            image: '/got-post.jpg',
            likes: 44,
            comments: 6,
            bookmarked: false
        },
        {
            id: '2',
            author: {
                name: 'James Clear',
                book: 'Sponsoring',
            },
            content: 'Vous cherchez à améliorer vos habitudes et à transformer votre vie? Ne cherchez plus! "Atomic Habits" de James Clear.',
            image: '/atomic-habits.jpg',
            likes: 32,
            comments: 4,
            bookmarked: true
        }
    ]);

    return (
        <div className="min-h-[100dvh] bg-background">
            <TopBar />

            {/* Feed Content avec padding ajusté */}
            <main className="pt-[120px] px-5 pb-[120px] space-y-6">
                {posts.map((post) => (
                    <article key={post.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent-200 flex items-center justify-center">
                                {post.author.avatar ? (
                                    <img 
                                        src={post.author.avatar} 
                                        alt={post.author.name}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                ) : (
                                    <User size={20} className="text-accent-500" />
                                )}
                            </div>
                            <div>
                                <h3 className="font-medium">{post.author.name}</h3>
                                <p className="text-sm text-muted-foreground">{post.author.book}</p>
                            </div>
                        </div>
                        <p className="text-sm">{post.content}</p>
                        {post.image && (
                            <div className="aspect-[4/3] bg-accent-100 rounded-lg overflow-hidden">
                                <img 
                                    src={post.image} 
                                    alt="Post" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1">
                                <span>❤️</span>
                                <span className="text-sm">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1">
                                <span>💬</span>
                                <span className="text-sm">{post.comments}</span>
                            </button>
                            <button>
                                <span>{post.bookmarked ? '🔖' : '🏷️'}</span>
                            </button>
                        </div>
                    </article>
                ))}
            </main>

            <BottomBar />
        </div>
    );
} 