'use client'

import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Clubs() {
    const router = useRouter()
    return (
        <>
            <div className="flex-1 px-5 pb-[120px] pt-[100px]">
                <div className="space-y-6">
                    <h1>Clubs</h1>
                </div>
            </div>

            <FloatingActionButton
                onClick={() => router.push('/clubs/create')}
                className="bottom-[110px]"
            />
        </>
    )
}
