'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to the Dashboard</h1>
      <p>You are signed in as: {session?.user?.email}</p>
      <button onClick={() => signOut({ callbackUrl: '/' })}>
        Sign Out
      </button>
    </div>
  );
}
