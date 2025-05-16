'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import { FaGoogle } from 'react-icons/fa'; // Import the Google icon

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/profile',
    });

    if (res?.ok) {
      router.push('/profile');
    } else {
      alert('Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    const res = await signIn('google', { redirect: false, callbackUrl: '/profile' });
    
    // If Google sign-in is successful, proceed to profile
    if (res?.ok) {
      router.push('/profile');
    } 
    // If OAuthAccountNotLinked error occurs, prompt the user to link their Google account or sign up
    else if (res?.error === 'OAuthAccountNotLinked') {
      alert('This Google account is not linked to an existing account. Please sign up or link your account.');
    } 
    // Other errors
    else {
      alert('An error occurred during Google sign-in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Sign In
        </h2>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Sign in with Email
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">or</div>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 w-full flex items-center justify-center border border-gray-300 bg-white text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
        >
          <FaGoogle className="mr-2 text-xl" />
          Sign in with Google
        </button>

        <div className="mt-6 text-center text-gray-600">
          <p>Don&#39;t forget to sign in! <Link href="/signup" className="text-indigo-600 hover:underline">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
