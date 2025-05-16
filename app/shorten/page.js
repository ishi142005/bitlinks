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
    const requestBody = { originalUrl };
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
      setShortUrl(`${window.location.origin}/${data.shortUrl}`);
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
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Shorten
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {shortUrl && (
          <p className="text-green-500 mt-4 text-center break-words">
            Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="underline">{shortUrl}</a>
          </p>
        )}
      </div>
    </div>
  );
}
