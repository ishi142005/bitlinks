"use client";
import { useState } from 'react';

export default function ShortenPage() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    const trimmedAlias = customAlias.trim();

    const requestBody = {
      originalUrl,
    };

    if (trimmedAlias.length > 0) {
      requestBody.shortUrl = trimmedAlias;
    }

    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.success) {
      setShortUrl(data.shortUrl);
    } else {
      setError(data.error || 'Unknown error');
    }
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen py-10 px-4 bg-gray-900">
<div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-black">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-6">
          Shorten Your URL
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="url"
            placeholder="Enter your URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Custom short URL (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-indigo-300 dark:border-indigo-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Shorten URL
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 text-center">
            <p className="text-green-600 font-medium">
              Shortened URL:
            </p>
            <a
              href={`/${shortUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline break-words"
            >
              {typeof window !== 'undefined' ? `${window.location.origin}/${shortUrl}` : `/${shortUrl}`}
            </a>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-red-500 font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
