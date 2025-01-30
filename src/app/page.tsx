"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Image from 'next/image';

const App: React.FC = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-primary">
      <div ref={containerRef} className="flex flex-col items-center gap-y-5">
        <Image src="/Bookish.svg" width={100} height={86} alt="Logo" />
        <p ref={textRef} className="text-4xl font-heading uppercase text-white font-bold">
          Bookish
        </p>
      </div>
    </div>
  );
};

export default App;
