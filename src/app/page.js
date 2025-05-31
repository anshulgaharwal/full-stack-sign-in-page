// src/app/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/signup'); // Or /signin if you prefer
  }, [router]);

  return null;
}
