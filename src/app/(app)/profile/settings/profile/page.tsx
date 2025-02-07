"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileSchema } from "@/schemas/profileSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { updateProfile } from "@/services/userService";
import { useRouter } from "next/navigation";

const ProfileEditPage: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
    });
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const router = useRouter();

    const onSubmit = async (data: ProfileSchema) => {
        try {
            await updateProfile(data);
            router.push("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="space-y-10">
            <div className="shadow-md rounded-xl">
                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex flex-col items-center mb-4">
                            <Avatar className="w-24 h-24 mb-2">
                                <AvatarImage src={profilePicture || "/default-avatar.png"} alt="Photo de profil" />
                                <AvatarFallback>PP</AvatarFallback>
                            </Avatar>
                            <Input
                                type="url"
                                placeholder="URL de l'image de profil"
                                {...register("profile_picture")}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                className="mt-2"
                            />
                            {errors.profile_picture && <p className="text-red-500">{errors.profile_picture.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
                            <Input
                                type="text"
                                placeholder="Nom d'utilisateur"
                                {...register("username")}
                                className="mt-1"
                            />
                            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <Input
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className="mt-1"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <Textarea
                                placeholder="Bio"
                                {...register("bio")}
                                className="mt-1"
                            />
                            {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
                        </div>

                        <Button type="submit" className="w-full">Mettre à jour le profil</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileEditPage;
