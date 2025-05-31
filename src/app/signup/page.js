'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './signup.css'; // Assuming you have a CSS file for styling

export default function SignUpPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // 🔁 If user is already logged in, redirect to /dashboard
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('');
    }
  }, [status, router]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit" className="btn-register">Register</button>

        <p style={{ marginTop: '1rem', color: '#ccc' }}>
          Already have an account?{' '}
          <Link href="/signin" style={{ color: '#4ea8ff', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>
      </form>

      <div style={{ marginTop: '2rem' }}>
        <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="btn-google"
        >
            Sign in with Google
        </button>
        </div>
    </div>
  );
}
