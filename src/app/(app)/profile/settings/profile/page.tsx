"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import {
  UpdateProfileRequest,
  ReadingHabit,
  UsagePurpose,
  ProfileVisibility,
} from "@/types/userTypes";
import { useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";
import { cn } from "@/lib/utils";

const AVAILABLE_GENRES = [
  "Fiction",
  "Non-fiction",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Fantasy",
  "Biography",
  "History",
  "Self-help",
  "Business",
  "Health",
  "Travel",
  "Cooking",
  "Art",
  "Poetry",
];

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNative, setIsNative] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [profileData, setProfileData] = useState<UpdateProfileRequest>({
    first_name: "",
    last_name: "",
    birth_date: "",
    bio: "",
    reading_habit: undefined,
    usage_purpose: undefined,
    preferred_genres: [],
    profile_visibility: undefined,
    allow_follow_requests: true,
    email_notifications: true,
    push_notifications: true,
    newsletter_subscribed: false,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Handle hydration and platform detection
  useEffect(() => {
    setIsMounted(true);
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getAuthenticatedProfile();
      const userData = response.data as any;

      // Handle different possible data structures
      const profileData = userData.profile || userData;
      const userInfo = userData.user || userData;

      // Format birth date for text input (extract YYYY/MM/DD from ISO string)
      const formatBirthDate = (dateStr: string) => {
        if (!dateStr) return "";
        try {
          const date = dateStr.split("T")[0]; // Extract YYYY-MM-DD part
          return date.replace(/-/g, "/"); // Convert to YYYY/MM/DD
        } catch {
          return "";
        }
      };

      setProfileData({
        first_name: profileData?.firstName || profileData?.first_name || "",
        last_name: profileData?.lastName || profileData?.last_name || "",
        birth_date: formatBirthDate(
          profileData?.birthDate || profileData?.birth_date || ""
        ),
        bio: profileData?.bio || "",
        reading_habit: profileData?.readingHabit || profileData?.reading_habit,
        usage_purpose: profileData?.usagePurpose || profileData?.usage_purpose,
        preferred_genres:
          profileData?.preferredGenres || profileData?.preferred_genres || [],
        profile_visibility:
          profileData?.profileVisibility || profileData?.profile_visibility,
        allow_follow_requests:
          profileData?.allowFollowRequests ??
          profileData?.allow_follow_requests ??
          true,
        email_notifications:
          profileData?.emailNotifications ??
          profileData?.email_notifications ??
          true,
        push_notifications:
          profileData?.pushNotifications ??
          profileData?.push_notifications ??
          true,
        newsletter_subscribed:
          profileData?.newsletterSubscribed ??
          profileData?.newsletter_subscribed ??
          false,
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Convert birth_date from YYYY/MM/DD to YYYY-MM-DD for API
      const formattedData = {
        ...profileData,
        birth_date: profileData.birth_date
          ? profileData.birth_date.replace(/\//g, "-")
          : "",
      };

      await userService.updateProfile(formattedData);
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UpdateProfileRequest, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenreToggle = (genre: string, checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      preferred_genres: checked
        ? [...(prev.preferred_genres || []), genre]
        : (prev.preferred_genres || []).filter((g) => g !== genre),
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Determine padding based on platform and hydration
  const topPadding = !isMounted
    ? "pt-[100px]"
    : isNative
      ? "pt-[110px]"
      : "pt-[75px]";

  return (
    <div className={cn("min-h-screen bg-gray-50 pb-24", topPadding)}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Modifier le profil</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSaving ? "Sauvegarde..." : "Sauvegarder"}</span>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={profileData.first_name}
                  onChange={(e) =>
                    handleInputChange("first_name", e.target.value)
                  }
                  placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom de famille</Label>
                <Input
                  id="lastName"
                  value={profileData.last_name}
                  onChange={(e) =>
                    handleInputChange("last_name", e.target.value)
                  }
                  placeholder="Votre nom de famille"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date de naissance</Label>
              <Input
                id="birthDate"
                type="text"
                value={profileData.birth_date}
                onChange={(e) =>
                  handleInputChange("birth_date", e.target.value)
                }
                placeholder="YYYY/MM/DD"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Parlez-nous un peu de vous..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reading Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Préférences de lecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Habitude de lecture</Label>
              <Select
                value={profileData.reading_habit}
                onValueChange={(value: ReadingHabit) =>
                  handleInputChange("reading_habit", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre habitude de lecture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="library_rat">
                    Rat de bibliothèque
                  </SelectItem>
                  <SelectItem value="occasional_reader">
                    Lecteur occasionnel
                  </SelectItem>
                  <SelectItem value="beginner_reader">
                    Lecteur débutant
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Objectif d'utilisation</Label>
              <Select
                value={profileData.usage_purpose}
                onValueChange={(value: UsagePurpose) =>
                  handleInputChange("usage_purpose", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre objectif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="find_books">Trouver des livres</SelectItem>
                  <SelectItem value="find_community">
                    Trouver une communauté
                  </SelectItem>
                  <SelectItem value="both">Les deux</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Genres préférés</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AVAILABLE_GENRES.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={(profileData.preferred_genres || []).includes(
                        genre
                      )}
                      onCheckedChange={(checked) =>
                        handleGenreToggle(genre, checked as boolean)
                      }
                    />
                    <Label htmlFor={genre} className="text-sm">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de confidentialité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Visibilité du profil</Label>
              <Select
                value={profileData.profile_visibility}
                onValueChange={(value: ProfileVisibility) =>
                  handleInputChange("profile_visibility", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la visibilité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends_only">Amis seulement</SelectItem>
                  <SelectItem value="private">Privé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autoriser les demandes de suivi</Label>
                <p className="text-sm text-gray-500">
                  Les autres utilisateurs peuvent vous demander de les suivre
                </p>
              </div>
              <Switch
                checked={profileData.allow_follow_requests}
                onCheckedChange={(checked) =>
                  handleInputChange("allow_follow_requests", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de notification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications par email</Label>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                checked={profileData.email_notifications}
                onCheckedChange={(checked) =>
                  handleInputChange("email_notifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications push</Label>
                <p className="text-sm text-gray-500">
                  Recevoir des notifications push sur votre appareil
                </p>
              </div>
              <Switch
                checked={profileData.push_notifications}
                onCheckedChange={(checked) =>
                  handleInputChange("push_notifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Newsletter</Label>
                <p className="text-sm text-gray-500">
                  S'abonner à notre newsletter
                </p>
              </div>
              <Switch
                checked={profileData.newsletter_subscribed}
                onCheckedChange={(checked) =>
                  handleInputChange("newsletter_subscribed", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button at Bottom */}
        <div className="pt-2 pb-6">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 py-2"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Sauvegarde en cours...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Sauvegarder les modifications</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
