"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ImagePlus } from "lucide-react";
import { postService } from "@/services/post.service";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPostSchema,
  POST_SUBJECTS,
  PostSubject,
} from "@/lib/validations/post";
import type { CreatePostFormData } from "@/lib/validations/post";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePost() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<CreatePostFormData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      subject: undefined,
      content: "",
      media: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (
        !file.type.match(
          /^(image\/(jpeg|png|gif|webp)|video\/(mp4|quicktime))$/
        )
      ) {
        toast.error("Type de fichier non supporté");
        return;
      }

      // Vérifier la taille du fichier (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La taille du fichier ne doit pas dépasser 10MB");
        return;
      }

      setSelectedImage(file);
      form.setValue("media", [file]);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      setIsLoading(true);
      const response = await postService.createPost(data);

      if (response.status === "success") {
        toast.success("Post créé avec succès");
        router.push("/feed");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Impossible de créer le post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 px-5 pb-[120px] pt-[120px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Donnez un titre à votre post"
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
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de post</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de post" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(POST_SUBJECTS).map(([value, label]) => (
                      <SelectItem
                        key={value}
                        value={value}
                        className="capitalize"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choisissez le type de votre publication pour aider les
                  lecteurs à la trouver
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Écrivez votre post ici..."
                    className="min-h-[200px] resize-none"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                disabled={isLoading}
              >
                <ImagePlus className="h-5 w-5 mr-2" />
                Ajouter une image
              </Button>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isLoading}
              />
            </div>
            {imagePreview && (
              <div className="relative aspect-video mt-4 rounded-lg overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                    form.setValue("media", []);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            )}
          </div>

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
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Publier"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
