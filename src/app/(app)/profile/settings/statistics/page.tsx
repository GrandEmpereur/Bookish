"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const StatisticsPage: React.FC = () => {
    return (
        <div className="space-y-10">
            <div className="shadow-md rounded-xl">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Statistiques</h1>
                    <div className="flex justify-around items-center py-4 bg-gray-50 rounded-lg mb-4 shadow-sm">
                        <div className="text-center">
                            <h3 className="text-sm text-gray-500">Amis</h3>
                            <p className="text-secondary text-lg font-bold text-[#a13a2e]">360</p>
                        </div>
                        <Separator orientation="vertical" className="h-12 mx-2" />
                        <div className="text-center">
                            <h3 className="text-sm text-gray-500">Livres lus</h3>
                            <p className="text-secondary text-lg font-bold text-[#a13a2e]">238</p>
                        </div>
                        <Separator orientation="vertical" className="h-12 mx-2" />
                        <div className="text-center">
                            <h3 className="text-sm text-gray-500">Club</h3>
                            <p className="text-secondary text-lg font-bold text-[#a13a2e]">16</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;
