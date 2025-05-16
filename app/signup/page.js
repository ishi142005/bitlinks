'use client';

import { signIn } from 'next-auth/react';
import { FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (data.success) {
      router.push('/signin');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
            required
          />
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
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 text-center text-gray-600">or</div>

        {/* Google Sign In Button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/profile' })}
          className="mt-4 w-full flex items-center justify-center border border-gray-300 bg-white text-gray-800 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200"
        >
          <FaGoogle className="mr-2 text-xl" />
          Sign up with Google
        </button>

        {/* Sign In Link */}
        <div className="mt-6 text-center text-gray-600">
          <p>
            Already have an account?{' '}
            <Link href="/signin" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
