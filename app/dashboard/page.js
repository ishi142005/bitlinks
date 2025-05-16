'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [originalUrl, setOriginalUrl] = useState('');
  const [customShort, setCustomShort] = useState('');
  const [finalShortUrl, setFinalShortUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  const handleShorten = async () => {
    if (!originalUrl || !customShort) {
      return alert('Please enter both original and short URL.');
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: originalUrl,
          shorturl: customShort,
          userId: session?.user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const shortLink = `${baseUrl}/${customShort}`;
        setFinalShortUrl(shortLink);
        setOriginalUrl('');
        setCustomShort('');
        confetti();
      } else {
        alert(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating short URL.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(finalShortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (status === 'loading') {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Shorten a New URL</h2>

      <input
        type="text"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
        placeholder="Enter original URL"
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-purple-500"
      />

      <input
        type="text"
        value={customShort}
        onChange={(e) => setCustomShort(e.target.value)}
        placeholder="Custom short URL (e.g. mylink123)"
        className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-purple-500"
      />

      <button
        onClick={handleShorten}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Shorten
      </button>

      {finalShortUrl && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md flex justify-between items-center">
          <a
            href={finalShortUrl}
            target="_blank"
            className="text-blue-600 hover:underline"
            rel="noopener noreferrer"
          >
            {finalShortUrl}
          </a>
          <button
            onClick={handleCopy}
            className="text-sm px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  );
}
