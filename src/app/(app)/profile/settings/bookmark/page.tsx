"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BookmarkPage: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="shadow-md rounded-xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Favoris</h1>
                    <p>Contenu des favoris...</p>
                    <Button className="mt-4">Ajouter un favori</Button>
                </div>
            </div>
        </div>
    );
};

export default BookmarkPage;
