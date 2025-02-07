'use client'

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

const GENRES = [
    "fantasy", "science-fiction", "romance", "thriller",
    "policier", "historique", "jeunesse", "manga",
    "poésie", "théâtre", "classique", "contemporain"
];

export default function CreateClub() {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim() !== '') {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulation d'une requête API
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast({
                title: "Club créé avec succès !",
                description: "Vous allez être redirigé vers la liste des clubs.",
            });

            // Redirection après un court délai pour laisser le temps de voir le toast
            setTimeout(() => {
                router.push('/clubs');
            }, 1000);

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Une erreur est survenue lors de la création du club.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='flex-1 pb-[120px] pt-[120px]'>
            <div className="max-w-2xl mx-auto px-4 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Créer un club</h1>
                    <p className="text-muted-foreground">Créez votre propre communauté de lecture</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Image de couverture */}
                    <div className="space-y-2">
                        <Label>Image de couverture</Label>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border-2 border-dashed">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt="Cover preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <p className="text-sm text-muted-foreground">
                                        Cliquez ou glissez une image ici
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 cursor-pointer opacity-0"
                                onChange={handleImageChange}
                            />
                        </div>
                    </div>

                    {/* Nom du club */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom du club</Label>
                        <Input id="name" placeholder="Ex: Club des Fans de Fantasy" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Décrivez votre club en quelques mots..."
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Type de club */}
                    <div className="space-y-2">
                        <Label>Type de club</Label>
                        <RadioGroup defaultValue="public" className="flex gap-4">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public">Public</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="private" id="private" />
                                <Label htmlFor="private">Privé</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Genre */}
                    <div className="space-y-2">
                        <Label htmlFor="genre">Genre</Label>
                        <select
                            id="genre"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                            <option value="">Sélectionnez un genre</option>
                            {GENRES.map(genre => (
                                <option key={genre} value={genre}>
                                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Règles */}
                    <div className="space-y-2">
                        <Label htmlFor="rules">Règles du club</Label>
                        <Textarea
                            id="rules"
                            placeholder="Définissez les règles de votre club..."
                            className="min-h-[100px]"
                        />
                    </div>

                    {/* Nombre maximum de membres */}
                    <div className="space-y-2">
                        <Label htmlFor="maxMembers">Nombre maximum de membres</Label>
                        <Input
                            id="maxMembers"
                            type="number"
                            min="1"
                            placeholder="Ex: 100"
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            placeholder="Ajoutez des tags (appuyez sur Entrée)"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {tag}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => removeTag(tag)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Bouton de soumission */}
                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Création en cours..." : "Créer le club"}
                    </Button>
                </form>
            </div>
        </div>
    );
}