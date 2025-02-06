'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImagePlus } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBookListSchema } from "@/lib/validations/book-list";
import type { CreateBookListInput } from "@/lib/validations/book-list";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Genre } from "@/types/book-list";
import Image from "next/image";

const genres: { value: Genre; label: string }[] = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'science-fiction', label: 'Science-fiction' },
    { value: 'romance', label: 'Romance' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'mystery', label: 'Mystère' },
    { value: 'horror', label: 'Horreur' },
    { value: 'historical', label: 'Historique' },
    { value: 'contemporary', label: 'Contemporain' },
    { value: 'literary', label: 'Littéraire' },
    { value: 'young-adult', label: 'Young Adult' },
    { value: 'non-fiction', label: 'Non-fiction' },
    { value: 'biography', label: 'Biographie' },
    { value: 'poetry', label: 'Poésie' },
    { value: 'comics', label: 'Comics' },
    { value: 'mixed', label: 'Mixte' }
];

export default function CreateBookList() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

    const form = useForm<CreateBookListInput>({
        resolver: zodResolver(createBookListSchema),
        defaultValues: {
            name: '',
            description: '',
            visibility: 'private',
            genre: 'mixed'
        }
    });

    const onSubmit = async (data: CreateBookListInput) => {
        try {
            setIsLoading(true);
            const response = await bookListService.createBookList(data);

            toast({
                title: "Succès",
                description: "Liste de lecture créée avec succès"
            });

            router.push('/library');
        } catch (error) {
            console.error("Error creating book list:", error);
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de créer la liste de lecture"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (file: File | null) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
            // Créer une URL pour la prévisualisation
            const previewUrl = URL.createObjectURL(file);
            setCoverImagePreview(previewUrl);
        }
    };

    // Nettoyer l'URL de prévisualisation lors du démontage du composant
    useEffect(() => {
        return () => {
            if (coverImagePreview) {
                URL.revokeObjectURL(coverImagePreview);
            }
        };
    }, [coverImagePreview]);

    return (
        <div className="flex-1 px-5 pb-[120px] pt-[120px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nom de la liste</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ma liste de lecture"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Description de votre liste..."
                                        className="resize-none"
                                        disabled={isLoading}
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Genre</FormLabel>
                                <Select 
                                    disabled={isLoading} 
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez un genre" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {genres.map((genre) => (
                                            <SelectItem 
                                                key={genre.value} 
                                                value={genre.value}
                                            >
                                                {genre.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Choisissez le genre principal de votre liste
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="visibility"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Liste publique
                                    </FormLabel>
                                    <FormDescription>
                                        Rendre cette liste visible par tous les utilisateurs
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value === 'public'}
                                        onCheckedChange={(checked) => 
                                            field.onChange(checked ? 'public' : 'private')
                                        }
                                        disabled={isLoading}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Image de couverture</FormLabel>
                                <FormControl>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            {coverImagePreview ? (
                                                <div className="relative w-24 h-32 rounded overflow-hidden">
                                                    <Image
                                                        src={coverImagePreview}
                                                        alt="Prévisualisation"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-24 h-32 flex items-center justify-center border-2 border-dashed rounded border-muted-foreground/25">
                                                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <Input
                                                    type="file"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    disabled={isLoading}
                                                    onChange={(e) => handleImageChange(e, onChange)}
                                                    {...field}
                                                    className="cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                        {coverImagePreview && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    onChange(null);
                                                    setCoverImagePreview(null);
                                                }}
                                                className="w-full"
                                            >
                                                Supprimer l'image
                                            </Button>
                                        )}
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Format acceptés : JPG, JPEG, PNG, WEBP. Taille maximale : 10MB
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                'Créer'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
} 