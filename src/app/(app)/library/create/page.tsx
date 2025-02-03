'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
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

export default function CreateBookList() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CreateBookListInput>({
        resolver: zodResolver(createBookListSchema),
        defaultValues: {
            name: '',
            description: '',
            visibility: 'private'
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
                                'Créer'
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
} 