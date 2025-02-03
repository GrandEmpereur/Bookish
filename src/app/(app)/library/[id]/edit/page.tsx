'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { bookListService } from "@/services/book-list.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateBookListSchema } from "@/lib/validations/book-list";
import type { UpdateBookListInput } from "@/lib/validations/book-list";
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

export default function EditBookList({ params }: { params: { id: string } }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<UpdateBookListInput>({
        resolver: zodResolver(updateBookListSchema),
    });

    useEffect(() => {
        loadBookList();
    }, [params.id]);

    const loadBookList = async () => {
        try {
            setIsLoading(true);
            const bookList = await bookListService.getBookList(params.id);
            form.reset({
                name: bookList.name,
                description: bookList.description,
                visibility: bookList.visibility as 'public' | 'private'
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger la liste"
            });
            router.push('/library');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: UpdateBookListInput) => {
        try {
            setIsLoading(true);
            await bookListService.updateBookList(params.id, data);
            toast({
                title: "Succès",
                description: "Liste mise à jour avec succès"
            });
            router.push(`/library/${params.id}`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de mettre à jour la liste"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 px-5 pb-[20px] pt-[120px]">
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
                                    />
                                </FormControl>
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
                                'Enregistrer'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
} 