// Contenu des posts possibles
const POST_CONTENTS = [
    "Je viens de finir ce livre incroyable ! Qu'en pensez-vous ? 📚",
    "Une belle découverte que je voulais partager avec vous ✨",
    "Mon passage préféré de ce chapitre... Attention spoiler !",
    "Quelqu'un d'autre a déjà lu cette série ?",
    "Voici ma dernière acquisition, j'ai hâte de commencer !",
    "Un classique à redécouvrir absolument",
    "Cette fin m'a laissé sans voix... Qui l'a lu ?",
    "Ma collection s'agrandit, voici les dernières entrées",
    "Un chef-d'œuvre que je recommande vivement",
    "Discussion du jour : votre personnage préféré ?"
];

// Messages possibles pour le chat
const CHAT_MESSAGES = [
    "Bonjour tout le monde ! 👋",
    "Qui a déjà lu le dernier tome ?",
    "J'adore ce passage !",
    "On se retrouve quand pour la prochaine discussion ?",
    "Je recommande vraiment ce livre",
    "Quelqu'un peut me conseiller un livre similaire ?",
    "Merci pour vos recommandations !",
    "Le personnage principal est fascinant",
    "Je n'arrive pas à le lâcher 📚",
    "Vivement la suite !"
];

// Fonction helper pour générer des posts aléatoires
const generatePosts = (clubId: string, authorName: string, count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: `${clubId}-post-${i + 1}`,
        author: {
            username: authorName,
            avatarUrl: `https://picsum.photos/seed/user${clubId}${i}/40/40`
        },
        content: POST_CONTENTS[Math.floor(Math.random() * POST_CONTENTS.length)],
        image: Math.random() > 0.5 ? `https://picsum.photos/seed/post${clubId}${i}/600/400` : null,
        createdAt: ["1h", "2h", "3h", "6h", "12h", "1j", "2j", "3j"][Math.floor(Math.random() * 8)],
        likesCount: Math.floor(Math.random() * 50) + 1,
        commentsCount: Math.floor(Math.random() * 20) + 1,
        isLiked: Math.random() > 0.5
    }));
};

const generateChatMessages = (clubId: string, members: any[], count: number) => {
    return Array.from({ length: count }, (_, i) => {
        const sender = members[Math.floor(Math.random() * members.length)];
        return {
            id: `${clubId}-msg-${i + 1}`,
            content: CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)],
            sender: {
                id: sender.id,
                username: sender.username,
                avatarUrl: sender.avatarUrl
            },
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)).toISOString(), // Messages des 7 derniers jours
            isMe: sender.id === "1" // Simuler que l'utilisateur connecté a l'ID "1"
        };
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const MOCK_CLUBS = [
    {
        id: "1",
        name: "Leo club",
        description: "Un club dédié aux passionnés de lecture et de découvertes littéraires",
        coverImage: "https://picsum.photos/seed/club1/400/400",
        moderator: {
            username: "Lila",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin1/40/40"
        },
        type: "private",
        memberCount: 153,
        isMember: true,
        members: {
            administrators: [
                {
                    id: "1",
                    username: "Lila",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin1/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("1", "Lila", 4),
        chat: generateChatMessages("1", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Lila", avatarUrl: "https://picsum.photos/seed/admin1/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "2",
        name: "Un thé & un livre",
        description: "Partagez vos lectures autour d'une tasse de thé",
        coverImage: "https://picsum.photos/seed/club2/400/400",
        moderator: {
            username: "Samir",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin2/40/40"
        },
        type: "public",
        memberCount: 180,
        isMember: true,
        members: {
            administrators: [
                {
                    id: "2",
                    username: "Samir",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin2/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("2", "Samir", 3),
        chat: generateChatMessages("2", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Samir", avatarUrl: "https://picsum.photos/seed/admin2/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "3",
        name: "Club SF",
        description: "Science-fiction, anticipation et futurs possibles",
        coverImage: "https://picsum.photos/seed/club3/400/400",
        moderator: {
            username: "Alex",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin3/40/40"
        },
        type: "public",
        memberCount: 245,
        isMember: true,
        members: {
            administrators: [
                {
                    id: "3",
                    username: "Alex",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin3/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("3", "Alex", 5),
        chat: generateChatMessages("3", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Alex", avatarUrl: "https://picsum.photos/seed/admin3/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "4",
        name: "Cercle des poètes",
        description: "Pour les amoureux de la poésie sous toutes ses formes",
        coverImage: "https://picsum.photos/seed/club4/400/400",
        moderator: {
            username: "Marie",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin4/40/40"
        },
        type: "private",
        memberCount: 89,
        isMember: true,
        members: {
            administrators: [
                {
                    id: "4",
                    username: "Marie",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin4/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("4", "Marie", 2),
        chat: generateChatMessages("4", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Marie", avatarUrl: "https://picsum.photos/seed/admin4/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "5",
        name: "Manga Club",
        description: "Discussions autour des mangas et de la culture japonaise",
        coverImage: "https://picsum.photos/seed/club5/400/400",
        moderator: {
            username: "Yuki",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin5/40/40"
        },
        type: "public",
        memberCount: 312,
        isMember: true,
        members: {
            administrators: [
                {
                    id: "5",
                    username: "Yuki",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin5/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("5", "Yuki", 4),
        chat: generateChatMessages("5", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Yuki", avatarUrl: "https://picsum.photos/seed/admin5/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "6",
        name: "Romans historiques",
        description: "Voyagez dans le temps à travers les livres",
        coverImage: "https://picsum.photos/seed/club6/400/400",
        moderator: {
            username: "Pierre",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin6/40/40"
        },
        type: "public",
        memberCount: 167,
        isMember: false,
        members: {
            administrators: [
                {
                    id: "6",
                    username: "Pierre",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin6/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("6", "Pierre", 3),
        chat: generateChatMessages("6", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Pierre", avatarUrl: "https://picsum.photos/seed/admin6/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "7",
        name: "Club des enquêteurs",
        description: "Pour les passionnés de romans policiers",
        coverImage: "https://picsum.photos/seed/club7/400/400",
        moderator: {
            username: "Sophie",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin7/40/40"
        },
        type: "private",
        memberCount: 142,
        isMember: false,
        members: {
            administrators: [
                {
                    id: "7",
                    username: "Sophie",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin7/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("7", "Sophie", 2),
        chat: generateChatMessages("7", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Sophie", avatarUrl: "https://picsum.photos/seed/admin7/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "8",
        name: "Fantasy Club",
        description: "Magie, dragons et mondes fantastiques",
        coverImage: "https://picsum.photos/seed/club8/400/400",
        moderator: {
            username: "Thomas",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin8/40/40"
        },
        type: "public",
        memberCount: 289,
        isMember: false,
        members: {
            administrators: [
                {
                    id: "8",
                    username: "Thomas",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin8/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("8", "Thomas", 5),
        chat: generateChatMessages("8", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Thomas", avatarUrl: "https://picsum.photos/seed/admin8/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "9",
        name: "Club des classiques",
        description: "Redécouvrez les grands classiques de la littérature",
        coverImage: "https://picsum.photos/seed/club9/400/400",
        moderator: {
            username: "Claire",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin9/40/40"
        },
        type: "public",
        memberCount: 198,
        isMember: false,
        members: {
            administrators: [
                {
                    id: "9",
                    username: "Claire",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin9/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("9", "Claire", 3),
        chat: generateChatMessages("9", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Claire", avatarUrl: "https://picsum.photos/seed/admin9/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    },
    {
        id: "10",
        name: "BD & Comics",
        description: "L'univers des bandes dessinées et comics",
        coverImage: "https://picsum.photos/seed/club10/400/400",
        moderator: {
            username: "Lucas",
            role: "modère ce club",
            avatarUrl: "https://picsum.photos/seed/admin10/40/40"
        },
        type: "private",
        memberCount: 234,
        isMember: false,
        members: {
            administrators: [
                {
                    id: "10",
                    username: "Lucas",
                    role: "Modéré par",
                    avatarUrl: "https://picsum.photos/seed/admin10/40/40"
                }
            ],
            moderators: []
        },
        posts: generatePosts("10", "Lucas", 4),
        chat: generateChatMessages("10", [
            { id: "1", username: "Moi", avatarUrl: "https://picsum.photos/seed/user1/40/40" },
            { id: "2", username: "Lucas", avatarUrl: "https://picsum.photos/seed/admin10/40/40" },
            { id: "3", username: "Sophie", avatarUrl: "https://picsum.photos/seed/user3/40/40" }
        ], 15)
    }
]; 